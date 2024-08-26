import { Request, Response, NextFunction } from "express";

import * as UserService from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            data: await UserService.getUserByUID(req.user.uid),
        });
    } catch (err: any) {
        next(err);
    }
}

export async function createUser(
    _req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
) {
    try {
        const result = await UserService.createUser(_req.body);
        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
