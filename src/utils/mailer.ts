import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SmtpOptions } from 'nodemailer-smtp-transport';

dotenv.config();

const options = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
} as SmtpOptions;

export const transport = nodemailer.createTransport(options);

export const sendEmail = (subject: string, recipient: string, template: string): void => {
  
  const mailOptions: Mail.Options = {
    from: process.env.EMAIL_ADDRESS,
    to: recipient,
    subject: subject,
    html: template,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};
