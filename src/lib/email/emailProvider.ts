export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  grandTotal: number;
  items: Array<{ title: string; quantity: number; price: number }>;
}

export class EmailService {
  /**
   * Dispatches order confirmation email
   */
  async sendOrderConfirmation(data: OrderEmailData) {
    console.log(`[EmailService] Dispatching Order Confirmation for ${data.orderNumber} to ${data.customerEmail}`);
    // In production with Resend:
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM || 'care@vaishiri.com',
    //   to: data.customerEmail,
    //   subject: `Order Confirmed: ${data.orderNumber} — Vaishiri Clothing`,
    //   html: renderTemplate(data),
    // });
    return { success: true, timestamp: new Date() };
  }

  /**
   * Dispatches tracking & dispatch notification
   */
  async sendShippingNotification(email: string, orderNumber: string, trackingNumber: string, courier: string) {
    console.log(`[EmailService] Dispatching Shipping Notice for ${orderNumber} (${courier}: ${trackingNumber}) to ${email}`);
    return { success: true };
  }
}

export const emailService = new EmailService();

