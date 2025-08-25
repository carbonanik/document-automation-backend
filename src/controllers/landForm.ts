import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

// Create a LandForm with owners and lands
export const createLandForm = async (req: Request, res: Response) => {
  try {
    const { formData, owners, lands } = req.body;

    const data: Prisma.LandFormCreateInput = {
      ...formData,
      createdBy: {
        connect: {
          id: req.user.userId,
        },
      },
      owners: {
        create: owners,
      },
      lands: {
        create: lands,
      },
    };

    const landForm = await prisma.landForm.create({
      data: data,
      include: {
        owners: true,
        lands: true,
      },
    });

    res.status(201).json(landForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create LandForm' });
  }
};

export const payAndCreateForm = async (req: Request, res: Response) => {
  try {
    const { formData, owners, lands } = req.body;
    const userId = req.user.userId;

    // get user 
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    let fee = 150;

    if (user?.price != null && user?.price != undefined) {
      fee = user!.price;
    }

    // 1. Fetch current balance
    const account = await prisma.account.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (!account) {
      return res.status(404).json({ error: "Insufficient balance" });
    }

    // 2. Check balance
    if (account.balance < fee) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 3. Decrement balance and create form inside transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { userId },
        data: {
          balance: { decrement: fee },
        },
      });

      const landForm = await tx.landForm.create({
        data: {
          ...formData,
          createdBy: {
            connect: { id: userId },
          },
          owners: { create: owners },
          lands: { create: lands },
        },
        include: {
          owners: true,
          lands: true,
        },
      });

      return landForm;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create LandForm" });
  }
};

// Get a LandForm by ID
export const getLandFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const landForm = await prisma.landForm.findUnique({
      where: { id },
      include: {
        owners: true,
        lands: true,
      },
    });

    if (!landForm) return res.status(404).json({ error: 'Form not found' });

    res.json(landForm);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLandFormByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const landForms = await prisma.landForm.findMany({
      where: {
        createdBy: {
          id: userId,
        },
      },
      include: {
        owners: true,
        lands: true,
      },
    });
    res.json(landForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get LandForm by User ID' });
  }
};

// Update a LandForm by ID (not replacing related owners/lands)
export const updateLandForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { formData } = req.body;

    const updated = await prisma.landForm.update({
      where: { id },
      data: formData,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update LandForm' });
  }
};

export const payAndUpdateLandForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { formData, owners, lands } = req.body;
    const userId = req.user.userId;

    // get user 
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    let fee = 150;

    if (user?.price != null && user?.price != undefined) {
      fee = user!.price;
    }

    // 1. Fetch current balance
    const account = await prisma.account.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (!account) {
      return res.status(404).json({ error: "Insufficient balance" });
    }

    // 2. Check balance
    if (account.balance < fee) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 3. Decrement balance and update form inside transaction

    const result = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { userId },
        data: {
          balance: { decrement: fee },
        },
      });

      const landForm = await tx.landForm.update({
        where: { id: id },
        data: {
          ...formData,
          owners: { set: owners },
          lands: { set: lands },
        },
        include: {
          owners: true,
          lands: true,
        },
      });

      return landForm;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update LandForm" });
  }
}

// Delete a LandForm and its children
export const deleteLandForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log(id);

    // Check if the LandForm exists first
    const landForm = await prisma.landForm.findUnique({ where: { id } });
    if (!landForm) return res.status(404).json({ error: 'LandForm not found' });

    // Delete related records manually if cascading is not set
    await prisma.owner.deleteMany({ where: { landFormId: id } });
    await prisma.landInfo.deleteMany({ where: { landFormId: id } });

    await prisma.landForm.delete({ where: { id } });

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete LandForm' });
  }
};

// Get all LandForms
export const getAllLandForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.landForm.findMany({
      include: {
        owners: true,
        lands: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};
