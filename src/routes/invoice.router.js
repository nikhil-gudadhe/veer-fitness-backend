import { Router } from 'express';
import { createInvoice, fetchInvoiceByMemberId } from '../controllers/invoice.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Create a new invoice
router.route('/generate-invoice').post(verifyJWT, verifyRole(['admin']), createInvoice);

// fetch member invoices
router.route('/fetch-invoices/:memberId').get(verifyJWT, verifyRole(['admin']),fetchInvoiceByMemberId);

export default router;