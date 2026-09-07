import { Router } from 'express';
import { createUser, getUsers, updateUserRole, deleteUser, updateUser } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
