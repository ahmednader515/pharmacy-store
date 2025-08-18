import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import { formatCurrency } from '@/lib/utils'
import { Order } from '@prisma/client'
import { getSetting } from '@/lib/actions/setting.actions'

type OrderInformationProps = {
  order: Order & { user?: { email: string; name: string }; orderItems?: any[]; shippingAddress?: any }
}

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: '123',
    userId: 'user123',
    expectedDeliveryDate: new Date(),
    paymentMethod: 'PayPal',
    paymentResult: null,
    itemsPrice: 100,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 100,
    isPaid: true,
    paidAt: new Date(),
    isDelivered: true,
    deliveredAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    orderItems: [
      {
        id: 'item123',
        orderId: '123',
        productId: 'product123',
        clientId: '123',
        name: 'Product 1',
        slug: 'product-1',
        category: 'Category 1',
        quantity: 1,
        countInStock: 10,
        image: 'https://via.placeholder.com/150',
        price: 100,
        size: 'M',
        color: 'Blue',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    shippingAddress: {
      id: 'addr123',
      orderId: '123',
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      postalCode: '12345',
      country: 'USA',
      province: 'New York',
      phone: '123-456-7890',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  } as unknown as OrderInformationProps['order'],
} satisfies OrderInformationProps
const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting()
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                    Order ID
                  </Text>
                  <Text className='mt-0 mr-4'>{order.id}</Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                    Purchased On
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                    Price Paid
                  </Text>
                  <Text className='mt-0 mr-4'>
                    {formatCurrency(Number(order.totalPrice))}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
              {(order.orderItems || []).map((item) => (
                <Row key={item.productId} className='mt-8'>
                  <Column className='w-20'>
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Img
                        width='80'
                        alt={item.name}
                        className='rounded'
                        src={
                          item.image.startsWith('/')
                            ? `${site.url}${item.image}`
                            : item.image
                        }
                      />
                    </Link>
                  </Column>
                  <Column className='align-top'>
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Text className='mx-2 my-0'>
                        {item.name} x {item.quantity}
                      </Text>
                    </Link>
                  </Column>
                  <Column align='right' className='align-top'>
                    <Text className='m-0 '>{formatCurrency(Number(item.price))}</Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: Number(order.itemsPrice) },
                { name: 'Tax', price: Number(order.taxPrice) },
                { name: 'Shipping', price: Number(order.shippingPrice) },
                { name: 'Total', price: Number(order.totalPrice) },
              ].map(({ name, price }) => (
                <Row key={name} className='py-1'>
                  <Column align='right'>{name}:</Column>
                  <Column align='right' width={70} className='align-top'>
                    <Text className='m-0'>{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
