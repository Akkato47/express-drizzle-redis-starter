import { RoleEnum } from '@/db/drizzle/schema/user/enums/role.enum';
import { InsertUser } from '@/db/drizzle/schema/user/schema';

export class CreateUserDto implements InsertUser {
  firstName: string;
  secondName: string;
  mail!: string;
  phone!: string | null;
  role!: RoleEnum;
  password?: string;
  oAuthId?: string | null;
}

export class UpdateUserDto implements Partial<InsertUser> {
  firstName?: string;
  secondName?: string;
  mail?: string;
  phone?: string | null;
  role?: RoleEnum;
  birthDate?: string;
  password?: string;
}
