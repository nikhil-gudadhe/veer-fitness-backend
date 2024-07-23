import { Enquiry } from '../models/enquiry.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

// Create a new enquiry
export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, mobile, reference, note } = req.body;

  if ([name, mobile, reference, note].some(field => !field || field.trim() === '')) {
    throw new apiError(400, 'All fields are required');
  }

  const newEnquiry = new Enquiry({
    name,
    mobile,
    reference,
    note
  });

  await newEnquiry.save();

  res.status(201).json(new apiResponse(201, newEnquiry, 'Enquiry created successfully'));
});

// Get all enquiries
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find();
  res.status(200).json(new apiResponse(200, enquiries, 'All enquiries fetched successfully'));
});

// Get a single enquiry by ID
export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.enquiryId);

  if (!enquiry) {
    throw new apiError(404, 'Enquiry not found');
  }

  res.status(200).json(new apiResponse(200, enquiry, 'Enquiry fetched successfully'));
});
