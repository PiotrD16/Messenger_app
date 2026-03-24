import {Request, Response} from "express";
import {registerUser} from "../services/registerAuthService";

export const registerRequest = async (req: Request, res: Response) => {

    const {userName, email, password, date_of_birth} = req.body;

    if (!userName || !email || !password || !date_of_birth) {
        return res.status(400).json({error: "Podaj wszystkie dane!"});
    }

    try{
        const result = await registerUser(email, password, userName, date_of_birth);
        if(!result){
            return res.status(409).json({error: "Uzytkownik o podanym adresie email juz istnieje!"});
        }
        return res.status(201).json({
            message: "Rejestracja pomyślna!",
            user: result
        });
    }

    catch(err){
        console.error("Błąd rejestracji:", err);
        return res.status(500).json({error: "Wystapil blad serwera!"});
    }
}