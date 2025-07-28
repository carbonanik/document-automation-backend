import express from 'express';
import { getUser, createUser, getAllUsers, deleteUser, getAccountBalance } from '../controllers/user';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/get-user', getUser);
router.get('/get-all-user', getAllUsers);
router.post('/create-user', createUser);
router.delete('/delete-user/:id', deleteUser);
router.get('/account-balance', authenticate, getAccountBalance);

export default router;
