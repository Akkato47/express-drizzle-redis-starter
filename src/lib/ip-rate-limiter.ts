import { getCustomValue, storeCustomValue } from '@/modules/auth/jwt.service';
import { CustomError } from '@/utils/custom_error';
import { ErrorMessage } from '@/utils/enums/errors';
import { HttpStatus } from '@/utils/enums/http-status';

export const ipRateLimiter = async (
  keyName: string,
  ip: string,
  maxRetry: number,
  expirationMinutes: number
) => {
  try {
    const tryValue = await getCustomValue(`${keyName}-${ip}`);
    const expiration = expirationMinutes * 60;
    if (!tryValue) {
      await storeCustomValue(`${keyName}-${ip}`, 1, expiration);
      return {
        result: true,
        attemptsLeft: maxRetry - 1
      };
    }
    const extractedValue = Number(tryValue[0]);

    if (extractedValue >= maxRetry || extractedValue + 1 === maxRetry) {
      throw new CustomError(HttpStatus.TOO_MANY_REQUESTS, ErrorMessage.ERROR_LIMIT);
    }
    await storeCustomValue(`${keyName}-${ip}`, extractedValue + 1, expiration);
    return {
      result: true,
      attemptsLeft: maxRetry - extractedValue - 1
    };
  } catch (error) {
    throw error;
  }
};
