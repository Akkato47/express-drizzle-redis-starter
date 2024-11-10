import {
  date,
  json,
  pgEnum,
  pgTable,
  text,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { RoleEnum } from './enums/role.enum';
import { baseSchema } from '../base.schema';
import { ImageType } from '@/modules/uploads/types/file.interface';

export const roleEnum = pgEnum('role', ['ORG', 'USER', 'ADMIN', 'SU']);

export const users = pgTable(
  'users',
  {
    ...baseSchema,
    oAuthId: varchar('oauth_id', { length: 16 }).unique(),
    firstName: text('first_name').notNull(),
    secondName: text('second_name').notNull(),
    mail: text('email').notNull().unique(),
    password: text('password'),
    phone: text('phone'),
    role: roleEnum('role').$type<RoleEnum>().default(RoleEnum.USER).notNull(),
    birthDate: date('birth_date'),
    image: json('image').$type<ImageType>(),
  },
  (table) => {
    return {
      usersMailUnique: unique('users_mail_unique').on(table.mail),
      usersPhoneUnique: unique('users_phone_unique').on(table.phone),
    };
  }
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const userProfleInfo = pgTable('user_profle_info', {
  ...baseSchema,
  userUid: uuid('user_uid').references(() => users.uid),
});
