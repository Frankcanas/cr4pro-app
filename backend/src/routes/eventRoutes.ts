import { Router } from 'express';
import { createEvent, getEvents, getEventAttendance } from '../controllers/eventController';

const router = Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id/attendance', getEventAttendance);

export default router;
