import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoute from "./routes/authRoutes";
import jwt from "jsonwebtoken";

import { createServer } from "http";
import { Server } from "socket.io";

import chatRoute from "./routes/chatRoutes";

import cookieParser from "cookie-parser";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import {unhideConversationForEveryone, saveMessage, getUserConversationIds, getConversationParticipants} from "./services/chatService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const io = new Server(httpServer, { cors: corsOptions });

AppDataSource.initialize()
    .then(() => {
        console.log("Połączono z bazą danych");
    })
    .catch((err) => {
        console.error("Nie udało się połączyć z bazą danych!", err);
    });

app.use("/api", authRoute);
app.use("/api/chat", chatRoute);

io.use((socket, next) => {
    // sprawdzenie tokenu aby wyslac i wyswietlac powiadomienia o wiadomosci
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
        const secret = process.env.ACCESS_TOKEN;
        if (!secret) throw new Error("Brak klucza!");

        const decoded = jwt.verify(token, secret);
        (socket as any).user = decoded;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

io.on("connection", async (socket) => {
    const user = (socket as any).user;
    console.log(`Socket połączony: ${user.userName} (ID: ${user.userId})`);

    const userRoom = `user_${user.userId}`;
    socket.join(userRoom);

    try {
        const conversationIds = await getUserConversationIds(user.userId);
        conversationIds.forEach((conversationId) => {
            socket.join(conversationId.toString());
        });
    } catch (e) {
        console.error("Błąd auto-join:", e);
    }

    socket.on("join_room", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${user.userId} dołączył do pokoju rozmowy ${conversationId}`);
    });

    socket.on("send_message", async (data) => {
        const { conversationId, content } = data;
        if (!content || !conversationId) return;

        try {
            const savedMsg = await saveMessage(
                conversationId,
                user.userId,
                content
            );

            await unhideConversationForEveryone(conversationId);

            const participantsIds = await getConversationParticipants(conversationId);

            participantsIds.forEach((participantId) => {
                const targetRoom = `user_${participantId}`;
                io.to(targetRoom).emit("should_refresh_chats", {
                    conversationId
                });
            });

            io.to(conversationId).emit("receive_message", {
                id: savedMsg.id,
                content: savedMsg.content,
                senderId: savedMsg.senderId,
                senderName: user.userName,
                createdAt: savedMsg.createdAt,
                conversationId
            });
        } catch (err) {
            console.error("Błąd send_message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket rozłączony: ${user.userName}`);
    });
});

const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
