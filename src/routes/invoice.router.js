import { Router } from 'express';
import { createInvoice, fetchInvoiceByMemberId, deleteAllInvoices } from '../controllers/invoice.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Create a new invoice
router.route('/generate-invoice').post(verifyJWT, verifyRole(['admin']), createInvoice);

// fetch member invoices
router.route('/fetch-invoices/:memberId').get(verifyJWT, verifyRole(['admin']),fetchInvoiceByMemberId);

// Delete all invoices
router.route('/delete-all').delete(verifyJWT, verifyRole(['admin']), deleteAllInvoices)


export default router;