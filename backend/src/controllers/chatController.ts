import { Request, Response } from 'express';
import {
    getUserConversations,
    createConversation,
    getChatMessages,
    deleteConversationForUser
} from "../services/chatService";

export const getMyChats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const chats = await getUserConversations(userId);
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const messages = await getChatMessages(Number(chatId));
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera" });
    }
};

export const createChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { recipientEmail } = req.body;

        const result = await createConversation(userId, recipientEmail);
        if (!result) return res.status(404).json({ error: "Nie znaleziono użytkownika" });

        res.status(201).json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { chatId } = req.params;

        await deleteConversationForUser(userId, Number(chatId));

        res.json({ message: "Czat został ukryty" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd usuwania czatu" });
    }
};