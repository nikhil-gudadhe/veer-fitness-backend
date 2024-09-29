import { Router } from 'express';
import { deleteAllMemberships } from '../controllers/membership.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Delete all invoices
router.route('/delete-all').delete(verifyJWT, verifyRole(['admin']), deleteAllMemberships)

export default router;