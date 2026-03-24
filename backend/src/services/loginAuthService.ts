import {AppDataSource} from '../data-source';
import {User} from '../entities/User'
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);

export async function loginUser(email: string, password: string){
    const user = await userRepository.findOne({where: {email}});
    if(!user) {return null}

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){ return null}

    return{
        id: user.id,
        email: user.email,
        userName: user.userName,
    }
}