// import { Resend } from "resend";

// export const resend = new Resend(process.env.RESEND_API_KEY);
// export const RESEND_FROM = process.env.RESEND_FROM!;

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT) || 587,
//   secure: false, // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export async function sendMail(to: string, subject: string, html: string) {
//   return transporter.sendMail({
//     from: process.env.SMTP_FROM,
//     to,
//     subject,
//     html,
//   });
// }

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
      from: process.env.EMAIL_FROM as string, // MUST be verified in SendGrid
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


