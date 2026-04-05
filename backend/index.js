import pool from './bd.js';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Task } from './models/Task.js';
import auth from './middleware/auth.js';
import { User } from './models/User.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'super_secret_key_123';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/me', auth, async(req, res) => {  
    try {
        const result = await pool.query(
            `SELECT id, login, first_name, last_name, middle_name FROM users WHERE id = $1`,
            [req.user.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Ошибка сервера` });
    }
});

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Server works!', time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/tasks', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { search, status, assignee_id, sortOrder } = req.query;

    const result = await Task.getAll({search, limit, offset, status, assignee_id, sortOrder});
    res.json(result);
 });


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, 
            first_name, 
            last_name, 
            middle_name 
            FROM users ORDER BY last_name`
        );
                        // Озеров Сергеевич Роман | first = Имя, last = Фамилия, middle = Отчество
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id,
            first_name,
            last_name,
            middle_name
            FROM users ORDER BY last_name`
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


 app.post('/tasks', auth, async (req, res) => {
    const {  
            title, 
            body, 
            status,
            assignee_id
        } = req.body;

    const creator_id = req.user.id;

    if (!title || !body || !assignee_id) {
        return res.status(400).json({ error: 'Все поля обязательны' })
    }

    const validStatuses = ['in_plans', 'in_progress', 'pause', 'done', 'canceled']
    const taskStatus = validStatuses.includes(status) ? status : 'in_plans';

    try {
        const task = await Task.create({
            title,
            body,
            status: taskStatus,
            creator_id,
            assignee_id
        });

        res.json({
            message: 'Задача успешно сохранена!',
            task
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
    }
 });


 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 });


// Для обновления статуса

app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status, assignee_id } = req.body;

    const validStatuses = ['in_plans', 'in_progress', 'pause', 'done', 'canceled'];

    try {

        if (status !== undefined) {
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: 'Недопустимый статус' });
            }
            
            const task = await Task.changeStatus(id, status);

            if (!task) {
                return res.status(404).json({ error: 'Задача не найдена' });
            }

            return res.json({ task });
        }
        
        if (assignee_id !== undefined) {
            const task = await Task.changeAssignee(id, assignee_id);
            if (!task) {
                return res.status(404).json({ error: 'Задача не найдена' });
            }

            return res.json({ task });
        }

        return res.status(400).json({ error: 'Нет данных для обновления' });


    } catch (err) {
        console.error('Ошибка при обновлении статуса', err)
        res.status(500).json({ error: err.message })
    }
});


// Добавляем роуты на регистрацию

app.post('/register', async (req, res) => {
    const { login, password, first_name, last_name, middle_name, is_active } = req.body;

    // Проверка на англ символы и цифры
    const ENG_SYMBOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

    if (!login.split("").every(char => ENG_SYMBOL.includes(char))) {
        return res.status(400).json({ error: 'Логин может содержать только латинские буквы и цифры!' })
    }

    // Проверка на путые поля
    if (!first_name || !last_name || !login || !password) {
        return res.status(400).json({ error: 'Логин, Фамилия, Имя и пароль обязательны' });
    }

    try {

        const existingUser = await User.getByLogin(login);
        if (existingUser) {
            return res.status(400).json({ error: `Такой логин уже существует` });
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

        res.json({
            message: `Пользователь зарегистрирован`,
            user: {
                id: user.id,
                login: user.login
            }
        });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Ошибка сервера` });
        }
    });

// Авторизация (для зарегистрированных)

app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    try {
        const user = await User.getByLogin(login);

        if (!user) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const token = jwt.sign(
            { id: user.id, login: user.login },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Успешный вход',
            token,
            user: {
                id: user.id,
                login: user.login
            }
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});