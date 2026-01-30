import pool from '../bd.js';

export class User {
    constructor({ id, first_name, last_name, middle_name, login, password, role, created_at }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.middle_name = middle_name;
        this.login = login;
        this.password = password;
        this.role = role;
        this.created_at = created_at
    }


    // Создание нового юзера
    static async create({ first_name, last_name, middle_name, login, password, role = 'пользователь' }) {
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, middle_name, login, password, role)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [first_name, last_name, middle_name, login, password, role]
        );
        return new User(result.rows[0]);
    }

    // Получение юзера по id
    static async getById(id) {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (!result.rows[0]) return null;
        return new User(result.rows[0]);
    }

    // Получение юзера по login
    static async getByLogin(login) {
        const result = await pool.query(`SELECT * FROM users WHERE login = $1`, [login]);
        if (!result.rows[0]) return null;
        return new User(result.rows[0]);
    }
}