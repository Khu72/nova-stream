import { Router } from 'express';
const router = Router();

import { verifyToken, getUserPermissions } from '../controllers/userController.js'

router.get('/verify', verifyToken, getUserPermissions);

export default router;