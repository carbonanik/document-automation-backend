import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// ✅ Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:3000', // your Next.js frontend URL
  credentials: true,              // if using cookies or authorization headers
})); 

app.use(express.json());

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

