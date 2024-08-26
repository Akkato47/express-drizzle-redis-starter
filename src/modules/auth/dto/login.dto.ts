import { SelectUser } from "@/db/postgres/schema/user/user.schema";

export class LoginUserDto implements Partial<SelectUser> {
    mail?: string;
    phone?: string;
    password!: string;
}
