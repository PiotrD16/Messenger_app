import { AppDataSource } from "../data-source";
import { Conversation } from "../entities/Conversation";
import { ConversationParticipant } from "../entities/ConversationParticipant";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

const conversationRepo = AppDataSource.getRepository(Conversation);
const participantRepo = AppDataSource.getRepository(ConversationParticipant);
const messageRepo = AppDataSource.getRepository(Message);
const userRepo = AppDataSource.getRepository(User);

export async function getUserConversations(userId: number) {
    const conversations = await participantRepo
        .createQueryBuilder("cp_me")
        .innerJoinAndSelect("cp_me.conversation", "c")
        .innerJoin("conversation_participants", "cp_other", "cp_other.conversation_id = c.id")
        .innerJoin("users", "u", "u.user_id = cp_other.user_id")
        .where("cp_me.user_id = :userId", { userId })
        .andWhere("cp_me.is_hidden = :isHidden", { isHidden: false })
        .andWhere("cp_other.user_id != :userId", { userId })
        .select([
            "c.id AS id",
            "u.user_name AS conversation_name",
            "c.created_at AS created_at"
        ])
        .orderBy("c.created_at", "DESC")
        .getRawMany();

    return conversations;
}

export async function getChatMessages(conversationId: number) {
    const messages = await messageRepo.find({
        where: { conversationId },
        relations: ["sender"],
        order: { createdAt: "ASC" },
        select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            sender: {
                userName: true
            }
        }
    });

    return messages.map(m => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        senderName: m.sender.userName,
        createdAt: m.createdAt
    }));
}

export async function createConversation(myId: number, recipientEmail: string) {
    const recipient = await userRepo.findOne({ where: { email: recipientEmail } });

    if (!recipient) return null;
    if (myId === recipient.id) throw new Error("Nie możesz pisać do siebie.");

    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const newConv = new Conversation();
        newConv.name = `Rozmowa ${myId}-${recipient.id}`;
        const savedConv = await transactionalEntityManager.save(newConv);

        // dodanie nadawcy
        const part1 = new ConversationParticipant();
        part1.conversation = savedConv;
        part1.userId = myId;
        await transactionalEntityManager.save(part1);

        // dodanie odbiorcy
        const part2 = new ConversationParticipant();
        part2.conversation = savedConv;
        part2.userId = recipient.id;
        await transactionalEntityManager.save(part2);

        return { id: savedConv.id, conversation_name: `Rozmowa: ${recipient.userName}` };
    });
}

export async function deleteConversationForUser(userId: number, conversationId: number) {
    await participantRepo.update(
        { userId, conversationId },
        { isHidden: true }
    );
    return true;
}

export async function unhideConversationForEveryone(conversationId: number) {
    await participantRepo.update(
        { conversationId },
        { isHidden: false }
    );
}

export async function saveMessage(conversationId: number, senderId: number, content: string) {
    const msg = new Message();
    msg.conversationId = conversationId;
    msg.senderId = senderId;
    msg.content = content;

    return await messageRepo.save(msg);
}

export async function getUserConversationIds(userId: number) {
    const parts = await participantRepo.find({
        where: { userId },
        select: ["conversationId"]
    });
    return parts.map(p => p.conversationId);
}

export async function getConversationParticipants(conversationId: number) {
    const parts = await participantRepo.find({
        where: { conversationId },
        select: ["userId"]
    });
    return parts.map(p => p.userId);
}