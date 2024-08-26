import { generateTag } from "@/utils/generate_tag";
import { ImageType } from "@/utils/types/file.type";
import { date, json, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["org", "user", "admin", "su"]);

export const viaEnum = pgEnum("via", ["base", "vk", "ya", "gos", "tg"]);

export const users = pgTable("users", {
    uid: uuid("uid").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    tag: text("tag")
        .$defaultFn(() => generateTag())
        .notNull(),
    mail: text("email").notNull().unique(),
    password: text("password").notNull(),
    phone: text("phone"),
    role: roleEnum("role").default("user").notNull(),
    birthDate: date("birth_date").notNull(),
    image: json("image").$type<ImageType>(),
    via: viaEnum("via").default("base").notNull(),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
