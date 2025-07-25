import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
};


declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload | any; // adjust type as needed
    }
  }
}