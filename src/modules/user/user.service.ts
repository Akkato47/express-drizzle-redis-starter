import { eq } from "drizzle-orm";

import { db } from "@/db/postgres/connect";
import { InsertUser, users } from "@/db/postgres/schema/user/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { CustomError } from "@/utils/custom_error";
import { hash } from "bcrypt";
import { LoginUserDto } from "../auth/dto/login.dto";

export const getUserByUID = async (uid: string) => {
    const user = await db.select().from(users).where(eq(users.uid, uid));
    return user[0];
};

export const getUserByLoginData = async (loginData: LoginUserDto) => {
    if (loginData.mail) {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.mail, loginData.mail));
        return user[0];
    } else if (loginData.phone) {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.phone, loginData.phone));
        return user[0];
    }
    throw new CustomError(400, "User not exists");
};

export const createUser = async (createUserDto: CreateUserDto) => {
    const tryUser = await db
        .select()
        .from(users)
        .where(eq(users.mail, createUserDto.mail));
    if (tryUser.length > 0) {
        throw new CustomError(409, "User Already Exists");
    }

    const hashPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashPassword;

    const user = await db
        .insert(users)
        .values({ ...createUserDto, password: hashPassword })
        .returning();
    console.log(user);
    return user[0];
};
