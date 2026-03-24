import { Request, Response } from 'express';
import { changeUserPassword } from '../services/passwordService';

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; // pobrane z tokena
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Podaj stare i nowe hasło" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Nowe hasło musi mieć min. 8 znaków" });
        }

        const success = await changeUserPassword(userId, oldPassword, newPassword);

        if (!success) {
            return res.status(401).json({ error: "Stare hasło jest nieprawidłowe" });
        }

        res.json({ message: "Hasło zostało zmienione pomyślnie" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd serwera" });
    }
};