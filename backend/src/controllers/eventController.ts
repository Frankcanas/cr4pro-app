import { Request, Response } from 'express';
import Event from '../models/Event';
import Attendance from '../models/Attendance';
import User from '../models/User';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { name, date } = req.body;
    const newEvent = await Event.create({ name, date });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({ order: [['date', 'DESC']] });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const records = await Attendance.findAll({
      where: { eventId: id, attended: true },
      include: [{ model: User, attributes: ['id', 'fullName', 'licensePlate', 'role'] }],
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
