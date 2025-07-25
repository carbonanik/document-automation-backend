// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = header.split(' ')[1];
  try {
    const jwtSecret = config.jwtSecret;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    } 
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // contains userId
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};
