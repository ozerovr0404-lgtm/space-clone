import express from 'express';
import { User } from './models/User.js'

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json({ user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).jsin({error: 'Пользователь не создан'})
    }
});

export default router;