import type { HttpStatus } from './enums/http-status';
import { httpMessages } from './http_messages';

export class CustomSuccess {
  statusCode: HttpStatus;
  message: string;

  constructor(statusCode: HttpStatus, customMessage?: string) {
    const defaultMessage = httpMessages[statusCode];
    this.message = customMessage
      ? `${defaultMessage}: ${customMessage}`
      : defaultMessage;
    this.statusCode = statusCode;
  }
}
