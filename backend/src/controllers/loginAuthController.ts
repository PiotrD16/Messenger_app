import {Request, Response} from 'express';
import {loginUser} from "../services/loginAuthService";
import {generateTokens} from "../services/tokenService";

export const loginRequest = async(req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        const result = await loginUser(email, password);

        if (!result) {
            return res.status(401).json({message: 'Niepoprawny login lub haslo!'});
        }

        const tokens = generateTokens({
            userId: result.id,
            email: result.email,
            userName: result.userName
        });

        res.cookie('jwt', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });

        return res.json({
            message: "Zalogowano pomyślnie!",
            accessToken: tokens.accessToken,
            user: result
        });

    } catch(err){
        console.error(err);
        return res.status(500).json({message: "Blad serwera!"});
    }
}