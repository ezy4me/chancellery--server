// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendContactForm(contactData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const { name, email, subject = 'Сообщение с сайта', message } = contactData;

    const mailOptions = {
      from: `"Форма контактов" <${process.env.MAIL_EMAIL}>`,
      to: process.env.CONTACT_EMAIL || process.env.MAIL_EMAIL,
      subject: subject,
      text: `
        Имя: ${name}
        Email: ${email}
        Сообщение: ${message}
      `,
      html: `
        <h2>Новое сообщение с формы контактов</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Сообщение успешно отправлено', info };
    } catch (error) {
      throw new Error(`Ошибка при отправке сообщения: ${error.message}`);
    }
  }
}
