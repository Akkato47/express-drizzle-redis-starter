import { CustomError } from "@/utils/custom_error";
import { Request, Response, NextFunction } from "express";
import token from "@/lib/token";
import { refresh } from "@/modules/auth/auth.service";

export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const extractedToken = extractTokenFromCookie(req);
        let user;

        if (extractedToken) {
            user = token.verify({
                token: extractedToken,
                tokenType: "access",
            });

            if (user) {
                req.user = user;
                return next();
            }
        }

        const refreshToken = extractRefreshTokenFromCookie(req);
        if (!refreshToken) {
            return next(new CustomError(401, "Unauthorized"));
        }

        const refreshedTokens = await refresh(refreshToken);
        if (!refreshedTokens) {
            return next(new CustomError(401, "Unauthorized")); // Если обновление не удалось
        }

        user = token.verify({
            token: refreshedTokens.token,
            tokenType: "access",
        });

        res.cookie("starter-access-token", refreshedTokens.token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        });
        res.cookie("starter-refresh-token", refreshedTokens.refresh, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        });

        req.user = user;
        return next();
    } catch (error) {
        next(new CustomError(401, "Unauthorized"));
    }
}
function extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies["starter-access-token"];
    return token ? token : undefined;
}

function extractRefreshTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies["starter-refresh-token"];
    return token ? token : undefined;
}
