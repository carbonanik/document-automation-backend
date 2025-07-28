import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/app-setting/:key
export const getAppSetting = async (req: Request, res: Response) => {

    const { key } = req.params;
    try {
        const setting = await prisma.appSetting.findUnique({ where: { key } });
        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.json({ value: setting.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
};

// POST /api/app-setting/:key
export const setAppSetting = async (req: Request, res: Response) => {
    const { key } = req.params;
    const { value } = req.body;
    if (typeof value !== 'string') {
        return res.status(400).json({ error: 'Value must be a string' });
    }
    try {
        const setting = await prisma.appSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
        res.json({ value: setting.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to set setting' });
    }
}; 