import { Request, Response } from 'express';
import User from '../models/User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, age, motorcycleModel, cylinderCapacity, documentId, licensePlate, role, password } = req.body;
    
    // Check if user already exists with that license plate or documentId
    const existingUser = await User.findOne({ where: { licensePlate } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this license plate already exists' });
    }

    const existingDoc = await User.findOne({ where: { documentId } });
    if (existingDoc) {
      return res.status(400).json({ message: 'User with this document ID already exists' });
    }

    const newUser = await User.create({
      fullName,
      age,
      motorcycleModel: motorcycleModel || 'Cr4',
      cylinderCapacity,
      documentId,
      licensePlate,
      role: role || 'Aspirantes',
      password: password || null,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(parseInt(id as string, 10));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(parseInt(id as string, 10));
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, age, motorcycleModel, cylinderCapacity, documentId, licensePlate, role, password } = req.body;
    
    const user = await User.findByPk(parseInt(id as string, 10));
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (motorcycleModel) user.motorcycleModel = motorcycleModel;
    if (cylinderCapacity) user.cylinderCapacity = cylinderCapacity;
    if (documentId) user.documentId = documentId;
    if (licensePlate) user.licensePlate = licensePlate;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
