import { InsertUser } from '@/db/drizzle/schema/user/schema';

export class CreateUserDto implements InsertUser {
  firstName: string;
  secondName: string;
  mail!: string;
  phone!: string | null;
  role!: 'ORG' | 'USER';
  password!: string;
  oAuthId?: string | null;
}

export class UpdateUserDto implements Partial<InsertUser> {
  firstName?: string;
  secondName?: string;
  mail?: string;
  phone?: string | null;
  role?: 'ORG' | 'USER' | 'ADMIN' | 'SU';
  birthDate?: string;
  password?: string;
}
