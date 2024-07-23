import { Router } from 'express';
import { createEnquiry, getAllEnquiries, getEnquiryById } from '../controllers/enquiry.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Route to create a new enquiry
router.route('/new').post(createEnquiry);

// Route to get all enquiries
router.route('/all-enquiries').get(verifyJWT, verifyRole(['admin']), getAllEnquiries);

// Route to get a single enquiry by ID
router.route('/:enquiryId').get(verifyJWT, verifyRole(['admin']), getEnquiryById);

export default router;