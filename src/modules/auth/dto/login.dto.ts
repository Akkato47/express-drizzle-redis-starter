import { SelectUser } from "@/db/drizzle/schema/user/user.schema";

export class LoginUserDto implements Partial<SelectUser> {
    mail?: string;
    phone?: string;
    password!: string;
}
