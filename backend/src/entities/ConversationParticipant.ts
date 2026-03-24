import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Conversation } from "./Conversation";

@Entity({ name: "conversation_participants" })
export class ConversationParticipant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "user_id" })
    userId!: number;

    @Column({ name: "conversation_id" })
    conversationId!: number;

    @Column({ name: "is_hidden", default: false })
    isHidden!: boolean;

    @CreateDateColumn({ name: "joined_at" })
    joinedAt!: Date;

    @ManyToOne(() => User, (user) => user.participations, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => Conversation, (conversation) => conversation.participants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "conversation_id" })
    conversation!: Conversation;
}