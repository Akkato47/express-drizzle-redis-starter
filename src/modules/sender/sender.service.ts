import { resolve } from 'node:path';
import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import config from '@/config';

import type { MailDto } from './dto/mail.dto';
import type { SendOptions } from './types/send-mail.type';

export const sendMail = async (options: SendOptions, data: MailDto, path: string) => {
  try {
    const transporter = createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password
      }
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: resolve(__dirname, 'templates'),
        defaultLayout: false
      },
      viewPath: resolve(__dirname, 'templates'),
      extName: '.hbs'
    };
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from: config.mail.from,
      to: options.to,
      subject: options.subject,
      template: `${path}`,
      context: {
        ...data
      }
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw error;
  }
};
