import { Request, Response } from 'express';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { licensePlate, password } = req.body;
    
    // In a real app we'd use bcrypt and JWT.
    // For this prototype, we'll do simple check.
    const user = await User.findOne({ where: { licensePlate } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    if (user.role !== 'Lideres') {
      return res.status(403).json({ message: 'No tienes permisos de Lider' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ 
      id: user.id, 
      fullName: user.fullName, 
      role: user.role,
      token: 'fake-jwt-token-lider' // In future use jsonwebtoken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
