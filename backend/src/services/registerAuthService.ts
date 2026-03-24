import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export async function registerUser(email: string, password: string, userName: string, birthDate: string) {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) return null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.userName = userName;
    newUser.birthDate = new Date(birthDate);

    await userRepository.save(newUser);
    return newUser;
}