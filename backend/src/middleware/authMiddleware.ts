import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload extends JwtPayload {
    userId: number;
    email: string;
    userName: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Brak dostępu. Token wymagany." });
    }

    const secret = process.env.ACCESS_TOKEN;

    if (!secret) {
        console.error("Błąd konfiguracji: Brak ACCESS_TOKEN_SECRET w .env");
        return res.sendStatus(500);
    }

    jwt.verify(token, secret, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
            return res.status(403).json({ message: "Token wygasł lub jest nieprawidłowy" });
        }

        if (!decoded) {
            return res.sendStatus(403);
        }

        (req as any).user = decoded as UserPayload;

        next();
    });
};