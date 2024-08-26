import redisClient from "@/db/redis";
import * as jwtService from "./jwt.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginUserDto } from "./dto/login.dto";
import * as userService from "../user/user.service";
import { CustomError } from "@/utils/custom_error";
import { compare } from "bcrypt";
import { TokenDto } from "./dto/create-token.dto";

export const login = async (userData: LoginUserDto) => {
    const user = await validateUser(userData);
    const payload: TokenDto = {
        role: user.role,
        uid: user.uid,
    };
    const data = { role: user.role, image: user.image };
    return { ...(await jwtService.createTokenAsync(payload)), data };
};

export const register = async (userData: CreateUserDto) => {
    const user = await userService.createUser(userData);
    const payload: TokenDto = {
        role: user.role,
        uid: user.uid,
    };
    const data = { role: user.role, image: user.image };
    return { ...(await jwtService.createTokenAsync(payload)), data };
};

export const logout = async (uid: string) => {
    await jwtService.removeAllTokensByUid(uid);
    return true;
};

export const refresh = async (refreshToken: string) => {
    const result = await jwtService.getToken(refreshToken);
    if (!result) {
        throw new CustomError(401, "Token is not valid");
    }
    const [userUid] = result[0].split(":");
    const user = await userService.getUserByUID(userUid);
    const tokens = await jwtService.createTokenAsync({
        uid: userUid,
        role: user.role,
    });
    await jwtService.removeToken(result[0]);
    return tokens;
};

const validateUser = async (userData: LoginUserDto) => {
    const user = await userService.getUserByLoginData(userData);

    if (!user) {
        throw new CustomError(400, "Неправильные почта/телефон или пароль");
    }
    const passwordEquals = await compare(userData.password, user.password);

    if (user && passwordEquals) {
        const { password, ...result } = user;
        return result;
    }
    throw new CustomError(400, "Неправильные почта/телефон или пароль");
};
