import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "./entities/User";
import { Conversation } from "./entities/Conversation";
import { ConversationParticipant } from "./entities/ConversationParticipant";
import { Message } from "./entities/Message";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User, Conversation, ConversationParticipant, Message],
    subscribers: [],
    migrations: [],
});