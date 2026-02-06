import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'my_space_clone_app_db',
    password: 'Veronica0404',
    port: 5432
});

export default pool;