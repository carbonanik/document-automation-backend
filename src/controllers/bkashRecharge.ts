import { PrismaClient, RechargeStatus } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create
export const createBkashRecharge = async (req: Request, res: Response) => {
  try { 
    const { amount, trxId, bkashNo } = req.body;
    const recharge = await prisma.bkashRecharge.create({
      data: { amount, trxId, bkashNo, userId: req.user.userId },
    });
    res.status(201).json(recharge);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create recharge', details: error });
  }
};

// Read all
export const getAllBkashRecharges = async (req: Request, res: Response) => {
  const recharges = await prisma.bkashRecharge.findMany({
    include: {
      user: true,
    },
  });
  res.json(recharges);
};

// Read one
export const getBkashRechargeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recharge = await prisma.bkashRecharge.findUnique({ where: { id: Number(id) } });
  if (!recharge) return res.status(404).json({ error: 'Not found' });
  res.json(recharge);
};

// Update
export const updateBkashRecharge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, bkashNo } = req.body;
  try {
    const recharge = await prisma.bkashRecharge.update({
      where: { id: Number(id) },
      data: { amount, bkashNo },
    });
    res.json(recharge);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update recharge', details: error });
  }
};

// Delete
export const deleteBkashRecharge = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.bkashRecharge.delete({ where: { id: Number(id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete recharge', details: error });
  }
};

// Update status
export const updateBkashRechargeStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!Object.values(RechargeStatus).includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const recharge = await prisma.bkashRecharge.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(recharge);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update status', details: error });
  }
}; 