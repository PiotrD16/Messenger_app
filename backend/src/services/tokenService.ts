import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenUserPayload{
    userId: number;
    email:string;
    userName:string;
}

export const generateTokens = (user: TokenUserPayload) => {

    const accessKey = process.env.ACCESS_TOKEN;
    const refreshKey = process.env.REFRESH_TOKEN;

    if(!accessKey || !refreshKey){
        throw new Error('No access key provided.');
    }

    const accessToken = jwt.sign(
        user,
        accessKey,
        {expiresIn: "2m"}
    );

    const refreshToken = jwt.sign(
        user,
        refreshKey,
        {expiresIn: "1h"}
    )

    return {accessToken, refreshToken};
}