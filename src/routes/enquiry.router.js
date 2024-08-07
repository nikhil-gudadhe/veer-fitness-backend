import { Router } from 'express';
import { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry } from '../controllers/enquiry.controller.js';
import { verifyJWT, verifyRole } from '../middleware/auth.middleware.js';

const router = Router();

// Route to create a new enquiry
router.route('/new').post(createEnquiry);

// Route to get all enquiries
router.route('/all-enquiries').get(verifyJWT, verifyRole(['admin']), getAllEnquiries);

// Route to get a single enquiry by ID
router.route('/:enquiryId').get(verifyJWT, verifyRole(['admin']), getEnquiryById);

// Route to update an existing enquiry
router.route("/edit/:enquiryId").patch(verifyJWT, verifyRole(["admin"]), updateEnquiry);

export default router;