import { CustomError } from '@/utils/custom_error';
import { HttpStatus } from '@/utils/enums/http-status';
import { createTransport } from 'nodemailer';
import type { SendOptions } from './types/send-mail.type';
import config from '@/config';
import hbs from 'nodemailer-express-handlebars';
import type { MailDto } from './dto/mail.dto';
import { resolve } from 'path';

export const sendMail = async (
  options: SendOptions,
  data: MailDto,
  path: string
) => {
  try {
    const transporter = createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: resolve(__dirname, 'templates'),
        defaultLayout: false,
      },
      viewPath: resolve(__dirname, 'templates'),
      extName: '.hbs',
    };
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from: config.mail.from,
      to: options.to,
      subject: options.subject,
      template: `${path}`,
      context: {
        ...data,
      },
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw error;
  }
};
