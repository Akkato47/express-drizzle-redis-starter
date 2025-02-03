import { hash } from 'bcrypt';
import { eq, or } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { users } from '@/db/drizzle/schema/user/schema';
import { CustomError } from '@/utils/custom_error';
import { HttpStatus } from '@/utils/enums/http-status';

import type { LoginUserDto } from '../auth/dto/login.dto';
import type { CreateUserDto } from './dto/create-user.dto';

export const getUserByUID = async (uid: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, uid));
    return user[0];
  } catch (error) {
    throw error;
  }
};

export const getUserByOAuthId = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.oAuthId, id));
    return user[0];
  } catch (error) {
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
      .where(or(eq(users.mail, loginData.mail), eq(users.phone, loginData.phone)));
    return user[0];
  } catch (error) {
    throw error;
  }
};

export const createUser = async (createUserDto: CreateUserDto) => {
  try {
    const tryUser = await db.select().from(users).where(eq(users.mail, createUserDto.mail));
    if (tryUser.length > 0) {
      throw new CustomError(HttpStatus.CONFLICT);
    }

    if (createUserDto.password) {
      const hashPassword = await hash(createUserDto.password, 10);
      createUserDto.password = hashPassword;
    }

    const user = await db
      .insert(users)
      .values({ ...createUserDto })
      .returning();

    if (createUserDto.password) {
      await db.update(users).set({ password: createUserDto.password });
    }
    return user[0];
  } catch (error) {
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
        role: users.role
      })
      .from(users)
      .where(eq(users.uid, userUid));
    if (!data[0]) {
      throw new CustomError(HttpStatus.NOT_FOUND, 'Пользователь не найден');
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};
