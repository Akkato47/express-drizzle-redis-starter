import { date, pgTable, text, unique, uuid, varchar } from 'drizzle-orm/pg-core';

import type { RoleType } from './types/role.type';

import { baseSchema } from '../base.schema';

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
    role: text('role').$type<RoleType>().default('USER').notNull(),
    birthDate: date('birth_date')
  },
  (table) => {
    return {
      usersMailUnique: unique('users_mail_unique').on(table.mail),
      usersPhoneUnique: unique('users_phone_unique').on(table.phone)
    };
  }
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const userProfle = pgTable('user_profle', {
  ...baseSchema,
  userUid: uuid('user_uid').references(() => users.uid)
});
