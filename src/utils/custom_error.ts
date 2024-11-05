import type { HttpStatus } from './enums/http-status';
import { httpMessages } from './http_messages';

export class CustomError extends Error {
  statusCode: HttpStatus;

  constructor(statusCode: HttpStatus, customMessage?: string) {
    const defaultMessage = httpMessages[statusCode];
    const message = customMessage
      ? `${defaultMessage}: ${customMessage}`
      : defaultMessage;
    super(message);
    this.statusCode = statusCode;
  }
}
