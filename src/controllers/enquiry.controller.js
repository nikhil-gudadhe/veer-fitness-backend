import { Enquiry } from '../models/enquiry.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

// Create a new enquiry
export const createEnquiry = asyncHandler(async (req, res) => {
  const {
    fullName,
    mobile,
    previousGymExperience,
    reference,
    fitnessGoal,
    target,
    preferredTimeSlot,
    note,
  } = req.body;

  const requiredFields = [
    { field: 'fullName', value: fullName },
    { field: 'mobile', value: mobile },
    { field: 'previousGymExperience', value: previousGymExperience },
    { field: 'fitnessGoal', value: fitnessGoal },
    { field: 'target', value: target },
    { field: 'preferredTimeSlot', value: preferredTimeSlot }
  ];

  const missingField = requiredFields.find(({ value }) => value === undefined || value === '');

  if (missingField) {
    throw new apiError(400, `${missingField.field} field is required`);
  }

  const newEnquiry = new Enquiry({
    fullName,
    mobile,
    previousGymExperience,
    reference,
    fitnessGoal,
    target,
    preferredTimeSlot,
    note,
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