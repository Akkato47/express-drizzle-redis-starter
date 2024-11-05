import * as express from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        uid: string;
        role: string;
        iat: number;
        exp: number;
        subject: string;
      };
    }
  }
}
