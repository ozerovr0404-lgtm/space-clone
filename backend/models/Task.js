import pool from '../bd.js';

export class Task {
    constructor({ id, title, body, status, creator_id, assignee_id, created_at, creator_full_name }) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.status = status;
        this.creator_id = creator_id;
        this.assignee_id = assignee_id;
        this.created_at = created_at;
        this.creator_full_name = creator_full_name;
    }


        static baseSelect = `
            SELECT
                t.*,
                CONCAT(u.first_name, ' ', u.middle_name, ' ', COALESCE(u.last_name, ''))
                AS creator_full_name
            FROM tasks t
            LEFT JOIN users u ON t.creator_id = u.id
        `;

        static async getAll() {
            const result = await pool.query(`
                ${this.baseSelect}
                ORDER BY t.created_at DESC
            `);

            return result.rows.map(row => new Task(row));
        }

        static async getById(id) {
            const result = await pool.query(`
                ${this.baseSelect}
                WHERE t.id = $1
            `, [id]);

            return result.rows[0]
        }

        static async create({ title, body, status, creator_id, assignee_id }) {
            const insertResult = await pool.query(
                `INSERT INTO tasks (title, body, status, creator_id, assignee_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
                [title, body, status, creator_id, assignee_id]
            );

            return this.getById(insertResult.rows[0].id);
    }

    static async changeStatus(id, newStatus) {
        await pool.query(
            `UPDATE tasks SET status = $1 WHERE id = $2`,
            [newStatus, id]
        );

        return this.getById(id);
    }
}