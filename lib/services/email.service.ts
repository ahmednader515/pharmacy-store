import { Order } from '@prisma/client'

// Email service with proper error handling
export const sendPurchaseReceipt = async ({ order }: { order: Order & { user?: { email: string; name: string }; orderItems?: any[]; shippingAddress?: any } }) => {
  try {
    if (!order.user?.email) {
      console.warn('Order user email not available, skipping email send')
      return
    }
    
    // For now, just log the email instead of sending it
    console.log('Purchase Receipt Email would be sent to:', order.user.email)
    console.log('Order details:', {
      orderId: order.id,
      totalPrice: order.totalPrice,
      user: order.user.name
    })
    
    // TODO: Implement email service later
    // await resend.emails.send({
    //   from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    //   to: order.user.email,
    //   subject: 'Order Confirmation',
    //   react: PurchaseReceiptEmail({ order }),
    // })
  } catch (error) {
    console.warn('Failed to send purchase receipt email:', error)
    // Don't throw error, just log it
  }
}

export const sendAskReviewOrderItems = async ({ order }: { order: Order & { user?: { email: string; name: string }; orderItems?: any[]; shippingAddress?: any } }) => {
  try {
    if (!order.user?.email) {
      console.warn('Order user email not available, skipping email send')
      return
    }

    // For now, just log the email instead of sending it
    console.log('Review Request Email would be sent to:', order.user.email)
    console.log('Order details:', {
      orderId: order.id,
      user: order.user.name
    })

    // TODO: Implement email service later
    // await resend.emails.send({
    //   from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    //   to: order.user.email,
    //   subject: 'Review your order items',
    //   react: AskReviewOrderItemsEmail({ order }),
    //   scheduledAt: oneDayFromNow,
    // })
  } catch (error) {
    console.warn('Failed to send review request email:', error)
    // Don't throw error, just log it
  }
}
