import {Request, Response} from 'express';
import {loginUser} from "../services/loginAuthService";
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken';
import {generateTokens} from "../services/tokenService";

interface DecodedToken extends JwtPayload {
    userId: number,
    email: string,
    userName: string
}

export const loginRequest = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(403);
        }

        const user = await loginUser(email, password);
        if(!user){
            return res.status(401).json({message: "Błędne dane logowania"})
        }

        const tokenPayload = {
            userId: user.id,
            email:user.email,
            userName: user.userName,
        }

        const tokens = generateTokens(tokenPayload);

        res.cookie("jwt", tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });

        res.json({
            accessToken: tokens.accessToken,
            user: tokenPayload,
        });

    } catch(err){
        console.log(err);
    }
}

// jesli refresh token sie zgadza to generujemy access token
export const refreshTokenRequest = async(req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt){return res.sendStatus(401)}

    const refreshToken = cookies.jwt;
    const refreshTokenFromServer = process.env.REFRESH_TOKEN;

    if(!refreshTokenFromServer){
        return res.status(500).json({error: "Błąd konfiguracji serwera"});
    }

    jwt.verify(refreshToken, refreshTokenFromServer, (err: VerifyErrors | null, decoded:string | JwtPayload | undefined) => {
        if(err) return res.sendStatus(403);

        const targetDecoded = decoded as DecodedToken;

        if(!targetDecoded || !targetDecoded.userId){
            return res.status(403);
        }

        const tokenPayload = {
            userId: targetDecoded.userId,
            email: targetDecoded.email,
            userName: targetDecoded.userName
        };

        const newTokens = generateTokens(tokenPayload);

        res.json({
            accessToken: newTokens.accessToken,
            user: tokenPayload,
        });
    });
};

export const logoutRequest = async(req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt)return res.sendStatus(204);

    res.clearCookie("jwt", {httpOnly: true, secure: false, sameSite: "lax"});
    res.json({messsage: "Wylogowano pomyślnie!"});
}