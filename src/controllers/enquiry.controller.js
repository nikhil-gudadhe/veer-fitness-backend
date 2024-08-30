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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const totalEnquiries = await Enquiry.countDocuments();
  const enquiries = await Enquiry.find().sort( { createdAt: -1 } ).skip(skip).limit(limit);

  res.status(200).json(new apiResponse(200, {
    enquiries,
    totalEnquiries,
    totalPages: Math.ceil(totalEnquiries / limit),
    currentPage: page,
  }, 'Enquiries fetched successfully'));
});

//Search enquiries
export const searchEnquiries = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!searchTerm) {
    throw new apiError(400, 'Search term is required');
  }

  const searchRegex = new RegExp(searchTerm, 'i');

  const query = {
    $or: [
      { fullName: searchRegex },
      { mobile: searchRegex }
    ],
  };

  const totalEnquiries = await Enquiry.countDocuments(query);
  const enquiries = await Enquiry.find(query).skip(skip).limit(limit);

  res.status(200).json(new apiResponse(200, {
    enquiries,
    totalEnquiries,
    totalPages: Math.ceil(totalEnquiries / limit),
    currentPage: page,
  }, 'Search results fetched successfully'));
});

// Get a single enquiry by ID
export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.enquiryId);

  if (!enquiry) {
    throw new apiError(404, 'Enquiry not found');
  }

  res.status(200).json(new apiResponse(200, enquiry, 'Enquiry fetched successfully'));
});

// Update an enquiry by ID
export const updateEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  
  const {
    fullName,
    mobile,
    previousGymExperience,
    reference,
    fitnessGoal,
    target,
    preferredTimeSlot,
    note
  } = req.body;

  const enquiry = await Enquiry.findById(enquiryId);

  if (!enquiry) {
    throw new apiError(404, 'Enquiry not found');
  }

  // Update only the provided fields
  if (fullName !== undefined) enquiry.fullName = fullName;
  if (mobile !== undefined) enquiry.mobile = mobile;
  if (previousGymExperience !== undefined) enquiry.previousGymExperience = previousGymExperience;
  if (reference !== undefined) enquiry.reference = reference;
  if (fitnessGoal !== undefined) enquiry.fitnessGoal = fitnessGoal;
  if (target !== undefined) enquiry.target = target;
  if (preferredTimeSlot !== undefined) enquiry.preferredTimeSlot = preferredTimeSlot;
  if (note !== undefined) enquiry.note = note;

  await enquiry.save();

  res.status(200).json(new apiResponse(200, enquiry, 'Enquiry updated successfully'));
});

// Delete enquiry by ID
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }

  await Enquiry.deleteOne({ _id: req.params.id });

  res.status(200).json(new apiResponse(200, { id: req.params.id }, 'Enquiry deleted successfully'));
});