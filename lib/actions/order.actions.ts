'use server'

import { Cart, OrderItem, ShippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { connectToDatabase } from '../db'
import { auth } from '@/auth'
import { OrderInputSchema } from '../validator'
import { revalidatePath } from 'next/cache'
import { sendAskReviewOrderItems, sendPurchaseReceipt } from '@/lib/services/email.service'
import { paypal } from '../paypal'
import { DateRange } from 'react-day-picker'
import data from '../data'

// CREATE
export const createOrder = async (clientSideCart: Cart) => {
  try {
    const connection = await connectToDatabase()
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot create order in mock mode' }
    }
    
    // recalculate price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )
    return {
      success: true, message: 'Order placed successfully',
      data: { orderId: createdOrder.id },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    throw new Error('Cannot create order in mock mode')
  }
  
  if (!connection.prisma) {
    throw new Error('Database connection failed')
  }
  
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  const orderData = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })
  
  return await connection.prisma.order.create({
    data: {
      userId: orderData.user as string,
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      paymentMethod: orderData.paymentMethod,
      paymentResult: orderData.paymentResult as any,
      itemsPrice: orderData.itemsPrice,
      shippingPrice: orderData.shippingPrice,
      taxPrice: orderData.taxPrice,
      totalPrice: orderData.totalPrice,
      isPaid: orderData.isPaid,
      paidAt: orderData.paidAt,
      isDelivered: orderData.isDelivered,
      deliveredAt: orderData.deliveredAt,
      orderItems: {
        create: orderData.items.map(item => ({
          productId: item.product,
          clientId: item.clientId,
          name: item.name,
          slug: item.slug,
          category: item.category,
          quantity: item.quantity,
          countInStock: item.countInStock,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
        }))
      },
      shippingAddress: {
        create: {
          fullName: orderData.shippingAddress.fullName,
          street: orderData.shippingAddress.street,
          city: orderData.shippingAddress.city,
          postalCode: orderData.shippingAddress.postalCode,
          country: orderData.shippingAddress.country,
          province: orderData.shippingAddress.province,
          phone: orderData.shippingAddress.phone,
        }
      }
    },
    include: {
      orderItems: true,
      shippingAddress: true,
      user: true
    }
  })
}

export async function updateOrderToPaid(orderId: string) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot update order in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const order = await connection.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })
    if (!order) throw new Error('Order not found')
    if (order.isPaid) throw new Error('Order is already paid')
    
    await connection.prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })
    
    if (!process.env.DATABASE_URL?.includes('localhost'))
      await updateProductStock(orderId)
    if (order.user.email) await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}
const updateProductStock = async (orderId: string) => {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return
    }
    
    if (!connection.prisma) {
      throw new Error('Database connection failed')
    }
    
    const order = await connection.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true }
    })
    if (!order) throw new Error('Order not found')

    for (const item of order.orderItems) {
      await connection.prisma.product.update({
        where: { id: item.productId },
        data: {
          countInStock: {
            decrement: item.quantity
          }
        }
      })
    }
    return true
  } catch (error) {
    throw error
  }
}
export async function deliverOrder(orderId: string) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot deliver order in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const order = await connection.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { email: true, name: true }
        }
      }
    })
    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')
    
    await connection.prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      }
    })
    
    if (order.user.email) await sendAskReviewOrderItems({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// DELETE
export async function deleteOrder(id: string) {
  try {
    const connection = await connectToDatabase()
    
    if (connection.isMock) {
      return { success: false, message: 'Cannot delete order in mock mode' }
    }
    
    if (!connection.prisma) {
      return { success: false, message: 'Database connection failed' }
    }
    
    const res = await connection.prisma.order.delete({
      where: { id }
    })
    if (!res) throw new Error('Order not found')
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL ORDERS

export async function getAllOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = data.settings[0];
  limit = limit || pageSize
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock order data')
    // Return mock orders from data.ts
    const mockOrders = data.orders.map((order, index) => ({
      ...order,
      id: `mock-order-${index + 1}`,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Different creation dates
      user: {
        name: data.users[index]?.name || 'Unknown User'
      }
    }))
    
    const skipAmount = (Number(page) - 1) * limit
    const paginatedOrders = mockOrders.slice(skipAmount, skipAmount + limit)
    
    return {
      data: JSON.parse(JSON.stringify(paginatedOrders)),
      totalPages: Math.ceil(mockOrders.length / limit),
    }
  }
  
  if (!connection.prisma) {
    console.warn('Database connection failed in getAllOrders')
    return {
      data: [],
      totalPages: 1,
    }
  }
  
  const skipAmount = (Number(page) - 1) * limit
  const orders = await connection.prisma.order.findMany({
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: skipAmount,
    take: limit,
  })
  const ordersCount = await connection.prisma.order.count()
  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}
export async function getMyOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = data.settings[0];
  limit = limit || pageSize
  const connection = await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  
  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock my orders data')
    // Return mock orders from data.ts for the current user
    const mockOrders = data.orders.map((order, index) => ({
      ...order,
      id: `mock-order-${index + 1}`,
      createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Different creation dates
      userId: session?.user?.id || 'mock-user-id',
    }))
    
    const skipAmount = (Number(page) - 1) * limit
    const paginatedOrders = mockOrders.slice(skipAmount, skipAmount + limit)
    
    return {
      data: JSON.parse(JSON.stringify(paginatedOrders)),
      totalPages: Math.ceil(mockOrders.length / limit),
    }
  }
  
  if (!connection.prisma) {
    console.warn('Database connection failed in getMyOrders')
    return {
      data: [],
      totalPages: 1,
    }
  }
  
  const skipAmount = (Number(page) - 1) * limit
  const orders = await connection.prisma.order.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: skipAmount,
    take: limit,
  })
  const ordersCount = await connection.prisma.order.count({
    where: { userId: session?.user?.id }
  })

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}
export async function getOrderById(orderId: string) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    console.log('📝 Mock mode: returning mock order by id')
    // Return mock order from data.ts
    const mockOrderIndex = parseInt(orderId.replace('mock-order-', '')) - 1
    if (mockOrderIndex >= 0 && mockOrderIndex < data.orders.length) {
      const mockOrder = {
        ...data.orders[mockOrderIndex],
        id: orderId,
        createdAt: new Date(Date.now() - (mockOrderIndex * 24 * 60 * 60 * 1000)),
      }
      return JSON.parse(JSON.stringify(mockOrder))
    }
    return null
  }
  
  if (!connection.prisma) {
    console.warn('Database connection failed in getOrderById')
    return null
  }
  
  const order = await connection.prisma.order.findUnique({
    where: { id: orderId }
  })
  return JSON.parse(JSON.stringify(order))
}

export async function createPayPalOrder(orderId: string) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    throw new Error('Cannot create PayPal order in mock mode')
  }
  
  if (!connection.prisma) {
    throw new Error('Database connection failed')
  }
  
  try {
    const order = await connection.prisma.order.findUnique({
      where: { id: orderId }
    })
    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
      await connection.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '0',
          }
        }
      })
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    throw new Error('Cannot approve PayPal order in mock mode')
  }
  
  if (!connection.prisma) {
    throw new Error('Database connection failed')
  }
  
  try {
    const order = await connection.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { email: true, name: true }
        },
        orderItems: true,
        shippingAddress: true
      }
    })
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as any)?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')
    
    await connection.prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: captureData.id,
          status: captureData.status,
          email_address: captureData.payer.email_address,
          pricePaid:
            captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
        }
      }
    })
    
    await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const { availableDeliveryDates } = data.settings[0];
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

// GET ORDERS BY USER
export async function getOrderSummary(date: DateRange) {
  try {
    // Validate date range
    if (!date || !date.from || !date.to) {
      console.error('Invalid date range provided:', date)
      throw new Error('Invalid date range provided')
    }
    
    const connection = await connectToDatabase()

    if (connection.isMock) {
      console.log('📝 Mock mode: returning mock order summary data')
      // Return mock data for order summary
      return {
        ordersCount: 3, // Mock orders from data.ts
        productsCount: data.products.length,
        usersCount: data.users.length,
        totalSales: 173.32, // Sum of mock orders
        monthlySales: [
          { label: '2024-01', value: 54.64 },
          { label: '2024-02', value: 40.51 },
          { label: '2024-03', value: 78.17 },
        ],
        salesChartData: [
          { date: '2024-01-15', totalSales: 54.64 },
          { date: '2024-02-20', totalSales: 40.51 },
          { date: '2024-03-10', totalSales: 78.17 },
        ],
        topSalesCategories: [
          { _id: 'Pain Relief', totalSales: 3 },
          { _id: 'Vitamins & Supplements', totalSales: 4 },
          { _id: 'Allergy & Sinus', totalSales: 1 },
        ],
        topSalesProducts: [
          { id: '1', label: 'Tylenol Extra Strength', image: '/images/p11-1.jpg', value: 25.98 },
          { id: '2', label: 'Centrum Silver Multivitamin', image: '/images/p13-1.jpg', value: 18.99 },
          { id: '3', label: 'Claritin 24-Hour', image: '/images/p14-1.jpg', value: 16.99 },
        ],
        latestOrders: [
          {
            id: 'order-1',
            user: { name: 'John Doe' },
            totalPrice: 54.64,
            createdAt: new Date('2024-01-15'),
          },
          {
            id: 'order-2',
            user: { name: 'Jane Harris' },
            totalPrice: 40.51,
            createdAt: new Date('2024-02-20'),
          },
          {
            id: 'order-3',
            user: { name: 'Jack Ryan' },
            totalPrice: 78.17,
            createdAt: new Date('2024-03-10'),
          },
        ],
      }
    }

    if (!connection.prisma) {
      throw new Error('Database connection failed')
    }

  const [ordersCount, productsCount, usersCount] = await Promise.all([
    connection.prisma.order.count({
      where: {
        createdAt: {
          gte: date.from,
          lte: date.to,
        },
      },
    }),
    connection.prisma.product.count({
      where: {
        createdAt: {
          gte: date.from,
          lte: date.to,
        },
      },
    }),
    connection.prisma.user.count({
      where: {
        createdAt: {
          gte: date.from,
          lte: date.to,
        },
      },
    }),
  ])

  // Calculate total sales
  const totalSalesResult = await connection.prisma.order.aggregate({
    where: {
      createdAt: {
        gte: date.from,
        lte: date.to,
      },
    },
    _sum: {
      totalPrice: true,
    },
  })
  const totalSales = totalSalesResult._sum.totalPrice || 0

  // Calculate monthly sales
  const today = new Date()
  const sixMonthEarlierDate = new Date(
    today.getFullYear(),
    today.getMonth() - 5,
    1
  )
  
  const monthlySalesData = await connection.prisma.order.findMany({
    where: {
      createdAt: {
        gte: sixMonthEarlierDate,
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  })

  // Process monthly sales data
  const monthlySalesMap = new Map<string, number>()
  monthlySalesData.forEach((order: any) => {
    const monthKey = order.createdAt.toISOString().slice(0, 7) // YYYY-MM format
    monthlySalesMap.set(monthKey, (monthlySalesMap.get(monthKey) || 0) + Number(order.totalPrice))
  })

  const monthlySales = Array.from(monthlySalesMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.label.localeCompare(a.label))

  const topSalesCategories = await getTopSalesCategories(date)
  const topSalesProducts = await getTopSalesProducts(date)

  const {
    common: { pageSize },
  } = data.settings[0];
  const limit = pageSize
  
  const latestOrders = await connection.prisma.order.findMany({
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

    const result = {
      ordersCount,
      productsCount,
      usersCount,
      totalSales: Number(totalSales),
      monthlySales: JSON.parse(JSON.stringify(monthlySales)),
      salesChartData: JSON.parse(JSON.stringify(await getSalesChartData(date))),
      topSalesCategories: JSON.parse(JSON.stringify(topSalesCategories)),
      topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
      latestOrders: JSON.parse(JSON.stringify(latestOrders)),
    }
    
    return result
  } catch (error) {
    console.error('Error in getOrderSummary:', error)
    throw error
  }
}

async function getSalesChartData(date: DateRange) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return []
  }

  if (!connection.prisma) {
    return []
  }

  const orders = await connection.prisma.order.findMany({
    where: {
      createdAt: {
        gte: date.from,
        lte: date.to,
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  })

  // Group by date and calculate total sales
  const salesByDate = new Map<string, number>()
  orders.forEach((order: any) => {
    const dateKey = order.createdAt.toISOString().split('T')[0] // YYYY-MM-DD format
    salesByDate.set(dateKey, (salesByDate.get(dateKey) || 0) + Number(order.totalPrice))
  })

  return Array.from(salesByDate.entries())
    .map(([date, totalSales]) => ({ date, totalSales }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function getTopSalesProducts(date: DateRange) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return []
  }

  if (!connection.prisma) {
    return []
  }

  const orders = await connection.prisma.order.findMany({
    where: {
      createdAt: {
        gte: date.from,
        lte: date.to,
      },
    },
    include: {
      orderItems: true,
    },
  })

  // Calculate total sales per product
  const productSales = new Map<string, { name: string; image: string; totalSales: number }>()
  
  orders.forEach((order: any) => {
    order.orderItems.forEach((item: any) => {
      const productId = item.productId
      const existing = productSales.get(productId)
      const itemTotal = item.quantity * Number(item.price)
      
      if (existing) {
        existing.totalSales += itemTotal
      } else {
        productSales.set(productId, {
          name: item.name,
          image: item.image,
          totalSales: itemTotal,
        })
      }
    })
  })

  return Array.from(productSales.entries())
    .map(([id, data]) => ({
      id,
      label: data.name,
      image: data.image,
      value: data.totalSales,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

async function getTopSalesCategories(date: DateRange, limit = 5) {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return []
  }

  if (!connection.prisma) {
    return []
  }

  const orders = await connection.prisma.order.findMany({
    where: {
      createdAt: {
        gte: date.from,
        lte: date.to,
      },
    },
    include: {
      orderItems: true,
    },
  })

  // Calculate total sales per category
  const categorySales = new Map<string, number>()
  
  orders.forEach((order: any) => {
    order.orderItems.forEach((item: any) => {
      const category = item.category
      categorySales.set(category, (categorySales.get(category) || 0) + item.quantity)
    })
  })

  return Array.from(categorySales.entries())
    .map(([category, totalSales]) => ({
      _id: category,
      totalSales,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit)
}
