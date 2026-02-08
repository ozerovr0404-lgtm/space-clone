import pool from '../bd.js';

export class Task {
    constructor({ id, title, creator, created_at, body, status, creator_id, assignee_id }) {
        this.id = id;
        this.title = title;
        this.creator = creator;
        this.created_at = created_at;
        this.body = body;
        this.status = status ?? 'in_plans';
        this.creator_id = creator_id;
        this.assignee_id = assignee_id 
    }

    // Создание новой задачи
    static async create({ title, creator, body, status = 'in_plans', creator_id, assignee_id }) {
        const result = await pool.query(
            `INSERT INTO tasks (title, creator, body, status, creator_id, assignee_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, creator, body, status, creator_id, assignee_id]
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
    async changeStatus(newStatus) {
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