import pool from './bd.js';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Task } from './models/Task.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'super_secret_key_123';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 });


 app.get('/users', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, first_name, last_name FROM users ORDER BY last_name'
        );
    
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


 app.post('/tasks', async (req, res) => {
    const {  
            title, 
            body, 
            status,
            assignee_id
        } = req.body;

    const creator_id = req.user.id;

    if (!title || !body) {
        return res.status(400).json({ error: 'Все поля обязательны' })
    }

    const validStatuses = ['in_plans', 'in_progress', 'pause', 'done', 'canceled']
    const taskStatus = validStatuses.includes(status) ? status : 'in_plans';

    try {
        const result = await pool.query(
            `INSERT INTO tasks (creator, title, body, status, creator_id, assignee_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [ 
                title, 
                body, 
                taskStatus,
                creator_id,
                assignee_id
            ]
        );

        console.log('Новая задача добавлена:' , result.rows[0]);

        res.json({
            message: 'Задача успешно сохранена!',
            task: result.rows[0]
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
    const { status } = req.body;

    const validStatuses = ['in_plans', 'in_progress', 'pause', 'done', 'canceled']
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Недопустимый статус' });
    }

    try {
        const task = await Task.getById(id);

        if (!task) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }

        const updateTask = await task.changeStatus(status);

        res.json({ task: updateTask });
    } catch (err) {
        console.error('Ошибка при обновлении статусв', err)
        res.status(500).json({ error: err.message })
    }
})


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