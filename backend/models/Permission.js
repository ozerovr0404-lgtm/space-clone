import pool from '../bd.js';

export class Permission {
    constructor({ id, title, description }) {
        this.id = id;
        this.title = title;
        this.description = description
    }


    // получение права по id
    static async getRigthById(id) {
        const result = await pool.query(`SELECT * FROM permissons WHERE id = $1`, [id]);
        if (!result.rows[0]) return null;
        return new Permission(result.rows[0]);
    }

    // получение права по title - наименование
    static async getRigthByTitle(title) {
        const result = await pool.query(`SELECT * FROM permissions WHERE title = $1`, [title]);
        if (!result.rows[0]) return null;
        return new Permission(result.rows[0]);
    }
}