import { InsertUser } from "@/db/postgres/schema/user/user.schema";

export class CreateUserDto implements InsertUser {
    fullName!: string;
    mail!: string;
    phone!: string | null;
    role!: "org" | "user";
    birthDate!: string;
    password!: string;
}

export class UpdateUserDto implements Partial<InsertUser> {
    fullName?: string;
    mail?: string;
    phone?: string | null;
    role?: "org" | "user" | "admin" | "su";
    birthDate?: string;
    password?: string;
}
