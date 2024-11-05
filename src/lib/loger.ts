import { createLogger, transports, format } from 'winston';

const logFormat = format.combine(
  format.timestamp({
    format: () => {
      const date = new Date();
      const utcOffset = 5 * 60 * 60 * 1000; // Смещение +5 часов в миллисекундах
      const localDate = new Date(date.getTime() + utcOffset);
      return localDate.toISOString().replace('T', ' ').substring(0, 19); // Форматируем дату
    },
  }),
  format.printf(
    (info) =>
      `[${info.timestamp}] - [${info.level.toUpperCase()}] - ${info.message}`
  ),
  format.colorize({ all: true })
);

export const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'app.log',
    }),
  ],
});

export class LoggerStream {
  write(message: string) {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
}
