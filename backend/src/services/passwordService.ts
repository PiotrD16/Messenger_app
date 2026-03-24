import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export async function changeUserPassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        throw new Error("Użytkownik nie istnieje");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return false;
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await userRepository.update(userId, { password: hashedNewPassword });

    return true;
}