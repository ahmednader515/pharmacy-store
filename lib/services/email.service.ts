import { Order } from '@prisma/client'

// Email service with proper error handling
export const sendPurchaseReceipt = async ({ order }: { order: Order & { user?: { email: string; name: string }; orderItems?: any[]; shippingAddress?: any } }) => {
  try {
    // Only import resend when actually needed
    const { Resend } = await import('resend')
    const { SENDER_EMAIL, SENDER_NAME } = await import('@/lib/constants')
    
    const resend = new Resend(process.env.RESEND_API_KEY as string)
    
    // Import the email component dynamically
    const PurchaseReceiptEmail = (await import('@/emails/purchase-receipt')).default
    
    if (!order.user?.email) {
      console.warn('Order user email not available, skipping email send')
      return
    }
    
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: 'Order Confirmation',
      react: PurchaseReceiptEmail({ order }),
    })
  } catch (error) {
    console.warn('Failed to send purchase receipt email:', error)
    // Don't throw error, just log it
  }
}

export const sendAskReviewOrderItems = async ({ order }: { order: Order & { user?: { email: string; name: string }; orderItems?: any[]; shippingAddress?: any } }) => {
  try {
    // Only import resend when actually needed
    const { Resend } = await import('resend')
    const { SENDER_EMAIL, SENDER_NAME } = await import('@/lib/constants')
    
    const resend = new Resend(process.env.RESEND_API_KEY as string)
    const oneDayFromNow = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

    // Import the email component dynamically
    const AskReviewOrderItemsEmail = (await import('@/emails/ask-review-order-items')).default

    if (!order.user?.email) {
      console.warn('Order user email not available, skipping email send')
      return
    }



    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: order.user.email,
      subject: 'Review your order items',
      react: AskReviewOrderItemsEmail({ order }),
      scheduledAt: oneDayFromNow,
    })
  } catch (error) {
    console.warn('Failed to send review request email:', error)
    // Don't throw error, just log it
  }
}
