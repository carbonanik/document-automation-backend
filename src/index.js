import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

