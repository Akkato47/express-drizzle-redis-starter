import { InsertUser } from "@/db/drizzle/schema/user/schema";

export class CreateUserDto implements InsertUser {
    firstName: string;
    secondName: string;
    mail!: string;
    phone!: string | null;
    role!: "org" | "user";
    password!: string;
}

export class UpdateUserDto implements Partial<InsertUser> {
    firstName?: string;
    secondName?: string;
    mail?: string;
    phone?: string | null;
    role?: "org" | "user" | "admin" | "su";
    birthDate?: string;
    password?: string;
}
