import { registerUser } from '../services/authServices/registerUser.js';
import { loginUser } from '../services/authServices/loginUser.js';

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.json({ message: 'Пользователь зарегистрирован', user: { id: user.id, login: user.login }});
    } catch (err) {
        console.error('Ошибка регистрации', err.message);
        res.status(400).json({ error: err.message });
    }
}


export const login = async (req, res) => {
    try {
        const {user, token} = await loginUser(req.body);
        res.json({ message: 'Авторизация успешна!', token, user: { id: user.id, login: user.login }});
    } catch (err) {
        console.error('Ошибка авторизации', err.message);
        res.status(400).json({ error: err.message })
    }
};