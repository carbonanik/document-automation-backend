// src/controllers/user.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';


const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      omit: {
        password: true,
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};



export const createUser = async (req: Request, res: Response) => {
  const { fullName, email, whatsapp, password, price } = req.body;

  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        whatsApp: whatsapp,
        password: hashedPassword,
        price: parseFloat(price) || 0,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      include: {
        account: {
          select: {
            balance: true,
          },
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (tx) => {
      await prisma.landForm.deleteMany({ where: { createdBy: { id: parseInt(id) } } });
      await prisma.account.delete({ where: { userId: parseInt(id) } });
      await prisma.bkashRecharge.deleteMany({ where: { userId: parseInt(id) } });
      await prisma.user.delete({ where: { id: parseInt(id) } });
    });
    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}

export const getAccountBalance = async (req: Request, res: Response) => {
  try {
    const account = await prisma.account.findUnique({ where: { userId: req.user.userId } });
    res.json({ balance: account ? account.balance : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
