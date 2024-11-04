import { eq, or } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { users } from '@/db/drizzle/schema/user/schema';
import type { CreateUserDto } from './dto/create-user.dto';
import { CustomError } from '@/utils/custom_error';
import { hash } from 'bcrypt';
import type { LoginUserDto } from '../auth/dto/login.dto';
import { HttpStatus } from '@/utils/enums/http-status';

export const getUserByUID = async (uid: string) => {
    try {
        const user = await db.select().from(users).where(eq(users.uid, uid));
        return user[0];
    } catch (error) {
        if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error;
    }
};

export const getUserByYID = async (yid: string) => {
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.yandexId, yid));
        return user[0];
    } catch (error) {
        if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error;
    }
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
                    eq(users.phone, loginData.phone)
                )
            );
        return user[0];
    } catch (error) {
        if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error;
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
        // FIXME Waiting for solving issue https://github.com/drizzle-team/drizzle-orm/issues/2694
        // if (createUserDto.password) {
        //     await db.update(users).set({ password: createUserDto.password });
        // }
        return user[0];
    } catch (error) {
        if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error;
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
                birthDate: users.birthDate,
                image: users.image,
                role: users.role,
            })
            .from(users)
            .where(eq(users.uid, userUid));
        if (!data[0]) {
            throw new CustomError(
                HttpStatus.BAD_REQUEST,
                'Пользователь не найден'
            );
        }

        return data[0];
    } catch (error) {
        if (error.statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        throw error;
    }
};
