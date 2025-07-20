import express from 'express';
import { register, login } from '../controllers/auth.js';
import { getUser } from '../controllers/user.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', authenticate, getUser); // 👈 Protected route

export default router;
