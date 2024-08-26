import { Request, Response, NextFunction } from "express";
import { CreateUserDto } from "../user/dto/create-user.dto";
import * as authService from "./auth.service";
import { LoginUserDto } from "./dto/login.dto";

export async function register(
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
) {
    const data = await authService.register(req.body);

    res.cookie("itugra-access-token", data.token, {
        expires: new Date(new Date().getTime() + 5 * 60 * 1000),

        httpOnly: true,
    });

    res.cookie("itugra-refresh-token", data.refresh, {
        expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),

        httpOnly: true,
    });

    return res.send(data.data).status(200);
}

export async function login(
    req: Request<{}, {}, LoginUserDto>,
    res: Response,
    next: NextFunction,
) {
    const data = await authService.login(req.body);

    res.cookie("itugra-access-token", data.token, {
        expires: new Date(new Date().getTime() + 5 * 60 * 1000),

        httpOnly: true,
    });

    res.cookie("itugra-refresh-token", data.refresh, {
        expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),

        httpOnly: true,
    });

    return res.send(data.data).status(200);
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    res.cookie("itugra-access-token", "", {
        expires: new Date(0),

        httpOnly: true,
    });

    res.cookie("itugra-refresh-token", "", {
        expires: new Date(0),

        httpOnly: true,
    });

    if (!req.user) {
        return res.send().status(500).json({ message: "Something went wrong" });
    }
    await authService.logout(req.user.uid);

    return res.send().status(200).json({ message: "ok" });
}
