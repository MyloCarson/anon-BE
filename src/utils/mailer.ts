import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.DEV_EMAIL_ADDRESS,
    pass: process.env.DEV_EMAIL_PASSWORD
  }
});
export const sendEmail = (subject: string, recipient: string, template: string): void => {
  const mailOptions: Mail.Options = {
    from: process.env.DEV_EMAIL_ADDRESS as string,
    // from: {
    // //   name: 'Anon',
    //   address: process.env.DEV_EMAIL_ADDRESS as string
    // },
    to: recipient,
    subject: subject,
    html: template,
    // text: "Hello world?"
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};
