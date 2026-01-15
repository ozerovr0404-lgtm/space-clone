const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());


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
    const { creator, title, body } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (creator, title, body) VALUES ($1, $2, $3) RETURNING *`,
            [creator, title, body]
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

