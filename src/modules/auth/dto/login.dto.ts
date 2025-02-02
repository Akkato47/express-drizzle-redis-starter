import type { SelectUser } from '@/db/drizzle/schema/user/schema';

export class LoginUserDto implements Partial<SelectUser> {
  mail?: string;
  phone?: string;
  password!: string;
}
