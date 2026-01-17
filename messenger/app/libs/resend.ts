

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendMail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM as string, 
      subject,
      html,
    };

    const response = await sgMail.send(msg);
    console.log("Email sent to:", to);
    
    // Return a consistent format
    return {
      messageId: response[0]?.headers?.['x-message-id'] || 'sendgrid-message',
      response: response[0]?.statusCode || 202
    };
  } catch (error: any) {
    console.error(
      "SendGrid error:",
      error?.response?.body || error.message
    );
    throw error;
  }
}


