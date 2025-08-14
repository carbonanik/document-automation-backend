import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import cors from 'cors';
import landFormRoutes from './routes/landForm';
import { authenticate } from './middlewares/auth';
import bkashRechargeRoutes from './routes/bkashRecharge';
import userRoutes from './routes/user';
import appSettingRoutes from './routes/appSetting';

const app = express();
const prisma = new PrismaClient();

// ✅ Enable CORS for frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL, // your Next.js frontend URL
  credentials: true,              // if using cookies or authorization headers
})); 

app.use(express.json());

app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/user', authenticate, userRoutes);
app.use('/api/land-forms', authenticate, landFormRoutes);
app.use('/api/bkash-recharge', authenticate, bkashRechargeRoutes);
app.use('/api/app-setting', appSettingRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});