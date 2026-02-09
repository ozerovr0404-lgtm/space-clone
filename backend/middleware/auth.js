import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super_secret_key_123';

function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('authHeader:', authHeader); //для отладки

    if (!authHeader) {
        return res.status(401).json({ error: 'Нет токена' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== `Bearer`) {
        return res.status(401).json({ error: 'Невалидный токен' });
    }

    const token = parts[1];
    console.log('token', token);

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error('Ошибка проверки токена:', error.message);
        return res.status(401).json({ error: 'Невалидный токен' });
    }
}

export default auth;