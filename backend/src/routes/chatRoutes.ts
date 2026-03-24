import express from "express";
import { getMyChats, createChat, getMessages } from "../controllers/chatController";
import { authenticateToken } from "../middleware/authMiddleware";
import { deleteChat } from "../controllers/chatController";

const router = express.Router();

// uruchomienie sprawdzenia tokenu w kazdym ponizszym endpoincie
router.use(authenticateToken);

router.get("/my-chats", getMyChats);
router.get("/messages/:chatId", getMessages);
router.post("/create", createChat);
router.delete("/:chatId", deleteChat);

export default router;