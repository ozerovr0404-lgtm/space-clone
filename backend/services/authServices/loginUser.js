import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key_123';

export const loginUser = async ({ login, password }) => {
    if (!login || !password) {
        throw new Error('Логин и пароль обязательны');
    }

    const user = await User.getByLogin(login);
    
    if (!user) {
        throw new Error('Неверный логин или пароль!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Неверный логин или пароль!');
    }

    const token = jwt.sign(
        { id: user.id, login: user.login },
        JWT_SECRET,
        { expiresIn: '1h'}
    );

    return {user, token};
};