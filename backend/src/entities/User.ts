import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Message } from "./Message";
import { ConversationParticipant } from "./ConversationParticipant";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn({ name: "user_id" })
    id!: number;

    @Column({ name: "user_email", unique: true })
    email!: string;

    @Column({ name: "user_password" })
    password!: string;

    @Column({ name: "user_name", unique: true })
    userName!: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @CreateDateColumn({name: "date_of_birth"})
    birthDate!: Date;

    // Relacje
    @OneToMany(() => ConversationParticipant, (participant) => participant.user)
    participations!: ConversationParticipant[];

    @OneToMany(() => Message, (message) => message.sender)
    messages!: Message[];
}