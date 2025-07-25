import express from 'express';
import { register, login } from '../controllers/auth';
import { getUser, createUser } from '../controllers/user';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user', authenticate, getUser); // 👈 Protected route
router.post('/create-user', authenticate, createUser);

export default router;
