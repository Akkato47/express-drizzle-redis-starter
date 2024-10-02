import { generateTag } from "@/utils/generate_tag";
import {
    boolean,
    date,
    json,
    pgEnum,
    pgTable,
    text,
    unique,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { Role } from "./enums/role.enum";
import { baseSchema } from "../base.schema";
import { ImageType } from "@/modules/uploads/types/file.type";

export const roleEnum = pgEnum("role", ["ORG", "USER", "ADMIN", "SU"]);

export const users = pgTable(
    "users",
    {
        ...baseSchema,
        fullName: text("full_name").notNull(),
        tag: text("tag")
            .$defaultFn(() => generateTag())
            .notNull(),
        mail: text("email").notNull().unique(),
        password: text("password").notNull(),
        phone: text("phone"),
        role: roleEnum("role").$type<Role>().default(Role.USER).notNull(),
        birthDate: date("birth_date").notNull(),
        image: json("image").$type<ImageType>(),
    },
    (table) => {
        return {
            usersTagUnique: unique("users_tag_unique").on(table.tag),
            usersMailUnique: unique("users_mail_unique").on(table.mail),
            usersPhoneUnique: unique("users_phone_unique").on(table.phone),
        };
    },
);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const userProfleInfo = pgTable("user_profle_info", {
    ...baseSchema,
    userUid: uuid("user_uid").references(() => users.uid),
});
