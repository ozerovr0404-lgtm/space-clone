import pool from '..bd.js';

export class Task {
    constructor({ id, title, creator, created_at, body, status }) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.created_at = created_at;
        this.body = body;
        this.status = status ?? 'in_plans'
    }

    // Создание новой задачи
    static async create({ title, creator, body, status = 'in_plans' }) {
        const result = await pool.query(
            `INSERT INTO tasks (title, creator, body, status)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, creator, body, status]
        );
        return new Task(result.rows[0]);
    }

    // Получение задачи по id
    static async getById(id) {
        const result = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
        if (!result.rows[0]) return null;
        return new Task(result.rows[0]);
    }

    // Получение задачи по статусу
    static async getByStatus(status) {
        const result = await pool.query(`SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC`, [status]);
        return result.rows.map(row => new Task(row));
    }

    static async getByCreator(creator) {
        const result = await pool.query(
            `SELECT * FROM tasks WHERE creator = $1`,
            [creator]
        );

        return result.rows.map(row => new Task(row));
    }

    // Обновление статуса задачи через отдельный метод
    async ChangeStatus(newStatus) {
        const result = await pool.query(
            `UPDATE tasks
            SET status =$1
            WHERE id = $2
            RETURNING *`,
            [newStatus, this.id]
        );

        if (!result.rows[0]) {
            throw new Error('Task not found');
        }

        return new Task(result.rows[0]);
    }
}