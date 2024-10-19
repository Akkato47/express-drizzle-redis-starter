import { eq, or } from "drizzle-orm";

import { db } from "@/db/drizzle/connect";
import { users } from "@/db/drizzle/schema/user/schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { CustomError } from "@/utils/custom_error";
import { hash } from "bcrypt";
import { LoginUserDto } from "../auth/dto/login.dto";
import { HttpStatus } from "@/utils/enums/http-status";

export const getUserByUID = async (uid: string) => {
    const user = await db.select().from(users).where(eq(users.uid, uid));
    return user[0];
};

export const getUserByLoginData = async (loginData: LoginUserDto) => {
    try {
        if (!loginData) {
            throw new CustomError(HttpStatus.BAD_REQUEST);
        }
        const user = await db
            .select()
            .from(users)
            .where(
                or(
                    eq(users.mail, loginData.mail),
                    eq(users.phone, loginData.phone),
                ),
            );
        return user[0];
    } catch (error) {
        throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const createUser = async (createUserDto: CreateUserDto) => {
    try {
        const tryUser = await db
            .select()
            .from(users)
            .where(eq(users.mail, createUserDto.mail));
        if (tryUser.length > 0) {
            throw new CustomError(HttpStatus.CONFLICT);
        }

        const hashPassword = await hash(createUserDto.password, 10);
        createUserDto.password = hashPassword;

        const user = await db
            .insert(users)
            .values({ ...createUserDto, password: hashPassword })
            .returning();
        return user[0];
    } catch (error) {
        console.log(error);
        throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

export const getUserProfile = async (userUid: string) => {
    try {
        const data = await db
            .select({
                uid: users.uid,
                firstName: users.firstName,
                secondName: users.secondName,
                mail: users.mail,
                phone: users.phone,
                tag: users.tag,
                birthDate: users.birthDate,
                image: users.image,
                role: users.role,
            })
            .from(users)
            .where(eq(users.uid, userUid));
        if (!data[0]) {
            throw new CustomError(
                HttpStatus.BAD_REQUEST,
                "Пользователь не найден",
            );
        }

        return data[0];
    } catch (error) {
        throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
