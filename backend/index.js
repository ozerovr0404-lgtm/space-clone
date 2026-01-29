const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super_secret_key_123';


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'my_space_clone_app_db',
    password: 'Veronica0404',
    port: 5432
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
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
 });


 app.post('/tasks', async (req, res) => {
    const { 
            creator, 
            title, 
            body, 
            status 
        } = req.body;

    if (!creator || !title || !body) {
        return res.status(400).json({ error: 'Все поля обязательны' })
    }

    const validStatuses = ['in_plans', 'in_progress', 'pause', 'done', 'canceled']
    const taskStatus = validStatuses.includes(status) ? status : 'in_plans';

    try {
        const result = await pool.query(
            `INSERT INTO tasks (creator, title, body, status) VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                creator, 
                title, 
                body, 
                taskStatus
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
        const result = await pool.query(
            `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }

        res.json({ task: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при обновлении статусв', err)
        res.status(500).json({ error: err.message })
    }
})


// Добавляем роуты на регистр

app.post('/register', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id, login, created_at',
            [login, hashedPassword]
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

