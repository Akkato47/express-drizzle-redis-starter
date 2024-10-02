import jwt from "jsonwebtoken";

import config from "@/config";

type GenerateOptions = {
    payload: string | object | Buffer;
    tokenType: "access" | "refresh" | "passwordReset";
};

type VerifyOptions = {
    token: string;
    tokenType: GenerateOptions["tokenType"];
};

export type DecodedToken = {
    uid: string;
    role: string;
    iat: number;
    exp: number;
    subject: string;
};

function selectFunc(tokenType: GenerateOptions["tokenType"]) {
    if (tokenType === "refresh") {
        return {
            secret: config.jwt.refresh.secret,
            expiresIn: config.jwt.refresh.expiresIn || "30d",
        };
    }
    if (tokenType === "passwordReset") {
        return {
            secret: config.jwt.passwordReset.secret,
            expiresIn: config.jwt.passwordReset.expiresIn || "5m",
        };
    }
    return {
        secret: config.jwt.access.secret,
        expiresIn: config.jwt.access.expiresIn || "5m",
    };
}

function generate({ payload, tokenType }: GenerateOptions): string {
    const { expiresIn, secret } = selectFunc(tokenType);

    return jwt.sign(payload, secret, {
        expiresIn,
        algorithm: "HS256",
        subject: tokenType,
    });
}

function verify({ token, tokenType }: VerifyOptions) {
    const { secret } = selectFunc(tokenType);

    try {
        return jwt.verify(token, secret, {
            algorithms: ["HS256"],
            subject: tokenType,
        }) as DecodedToken;
    } catch (error) {
        if (tokenType === "access") {
            return null;
        }
        return error;
    }
}

export default {
    verify,
    generate,
};
