import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Conversation } from "./Conversation";

@Entity({ name: "messages" })
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "message_content", type: "text" })
    content!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @Column({ name: "sender_id" })
    senderId!: number;

    @Column({ name: "conversation_id" })
    conversationId!: number;

    @ManyToOne(() => User, (user) => user.messages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "sender_id" })
    sender!: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "conversation_id" })
    conversation!: Conversation;
}