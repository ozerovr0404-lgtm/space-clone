import pool from './bd.js';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Task } from './models/Task.js';
import auth from './middleware/auth.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'super_secret_key_123';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/me', auth, (req, res) => {  // тестовый роут
    res.json(req.user);
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
    try {
        const tasks = await Task.getAll();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 });


 app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, first_name, last_name, middle_name FROM users ORDER BY last_name`
        );
                        // Озеров Сергеевич Роман | first = Имя, middle = Отчество, last = Фамилия
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
    const { login, password, first_name, last_name, middle_name, role } = req.body;

    // Проверка на англ символы и цифры
    const ENG_SYMBOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';

    if (!login.split("").every(char => ENG_SYMBOL.includes(char))) {
        return res.status(400).json({ error: 'Логин может содержать только латинские буквы и цифры!' })
    }
    console.log(req.body)
    // Проверка на путые поля
    if (!first_name || !last_name || !login || !password) {
        return res.status(400).json({ error: 'Логин, Фамилия, Имя и пароль обязательны' });
    }
    console.log(req.body)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (login, password, first_name, last_name, middle_name, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, login, created_at, first_name, last_name, middle_name, role',
            [
                login, 
                hashedPassword,
                first_name,
                last_name,
                middle_name || null,
                role || null
            ]
        );

        res.json({
            message: 'Пользователь зарегистрирован',
            user: result.rows[0]
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Такой логин уже существует' });
        }
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Авторизация (для зарегистрированных)

app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        }

        const user = result.rows[0];

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