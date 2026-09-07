import { Router } from 'express';
import { markAttendance, getAttendanceByEvent } from '../controllers/attendanceController';

const router = Router();

router.post('/', markAttendance);
router.get('/:eventId', getAttendanceByEvent);

export default router;
