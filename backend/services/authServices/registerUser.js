import bcrypt from 'bcrypt';
import { User } from '../../models/User.js';

export const registerUser = async ({ login, password, first_name, last_name, middle_name, is_active }) => {

    const ENG_SYMBOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

    if (!first_name || !last_name || !login || !password) {
        throw new Error('Все поля обязательны');
    }

    if (!login.split("").every(char => ENG_SYMBOL.includes(char))) {
        throw new Error('Логин может содержать только латинские буквы и цифры!');
    }

    const existingUser = await User.getByLogin(login);
    if (existingUser) {
        throw new Error('Такой логин уже существует!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.createWithHashedPassword({
            first_name,
            last_name,
            middle_name,
            login,
            password: hashedPassword,
            is_active
        });

        return user;
};

