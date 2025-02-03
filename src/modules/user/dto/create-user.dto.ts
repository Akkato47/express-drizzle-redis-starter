import type { InsertUser } from '@/db/drizzle/schema/user/schema';
import type { RoleType } from '@/db/drizzle/schema/user/types/role.type';

export class CreateUserDto implements InsertUser {
  firstName: string;
  secondName: string;
  mail!: string;
  phone!: string | null;
  role!: RoleType;
  password?: string;
  oAuthId?: string | null;
}

export class UpdateUserDto implements Partial<InsertUser> {
  firstName?: string;
  secondName?: string;
  mail?: string;
  phone?: string | null;
  role?: RoleType;
  birthDate?: string;
  password?: string;
}
