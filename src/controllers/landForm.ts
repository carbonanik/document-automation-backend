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
    
    await prisma.account.update(
      {
        where: {
          userId: req.user.userId,
        },
        data: {
          balance: {
            decrement: 150,
          },
        },
      }
    );

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
}

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
