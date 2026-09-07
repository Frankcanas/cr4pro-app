import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import User from '../models/User';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { eventId, attendances } = req.body;
    // attendances is an array of { userId: number, attended: boolean }

    for (let record of attendances) {
      const existing = await Attendance.findOne({ where: { eventId, userId: record.userId } });
      if (existing) {
        existing.attended = record.attended;
        await existing.save();
      } else {
        await Attendance.create({
          eventId,
          userId: record.userId,
          attended: record.attended,
        });
      }
    }

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAttendanceByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const records = await Attendance.findAll({
      where: { eventId },
      include: [{ model: User, attributes: ['id', 'fullName', 'licensePlate'] }],
    });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
