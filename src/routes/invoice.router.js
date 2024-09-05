import { Router } from 'express';
import { createInvoice } from '../controllers/invoice.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Create a new invoice
router.route('/generate-invoice').post(verifyJWT, verifyRole(['admin']),createInvoice);

export default router;