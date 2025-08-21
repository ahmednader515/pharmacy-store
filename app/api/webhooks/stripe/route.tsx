import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { sendPurchaseReceipt } from '@/lib/services/email.service'
import { connectToDatabase } from '@/lib/db'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    return new NextResponse('Stripe not configured', { status: 500 })
  }
  
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const orderId = charge.metadata.orderId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount
    
    const connection = await connectToDatabase()
    if (connection.isMock) {
      throw new Error('Database not available')
    }
    const { prisma } = connection
    
    if (!prisma) {
      return new NextResponse('Database connection failed', { status: 500 })
    }
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, name: true } } }
    })
    
    if (order == null) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          id: event.id,
          status: 'COMPLETED',
          email_address: email!,
          pricePaid: (pricePaidInCents / 100).toFixed(2),
        }
      }
    })
    
    try {
      await sendPurchaseReceipt({ order })
    } catch (err) {
      console.log('email error', err)
    }
    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }
  return new NextResponse()
}
