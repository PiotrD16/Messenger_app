import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { ConversationParticipant } from "./ConversationParticipant";
import { Message } from "./Message";

@Entity({ name: "conversations" })
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "conversation_name", nullable: true })
    name!: string;

    @Column({ name: "is_group", default: false })
    isGroup!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @OneToMany(() => ConversationParticipant, (participant) => participant.conversation)
    participants!: ConversationParticipant[];

    @OneToMany(() => Message, (message) => message.conversation)
    messages!: Message[];
}