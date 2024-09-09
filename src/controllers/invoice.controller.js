import { Invoice } from '../models/invoice.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { Member } from '../models/member.model.js';
import { Membership } from '../models/membership.model.js';

// Create a new invoice
export const createInvoice = asyncHandler(async (req, res) => { 
  const { memberId } = req.body; // No extensionId needed

  const member = await Member.findById(memberId).populate('membership');

  if (!member) {
    throw new apiError(404, 'Member not found');
  }

  const membership = await Membership.findById(member.membership._id).populate('plan');

  if (!membership) {
    throw new apiError(404, 'Membership not found');
  }

  // Check for latest extension, if any
  const latestExtension = membership.extensions.length > 0
    ? membership.extensions[membership.extensions.length - 1]  // Get the last extension
    : null;

  console.log('Latest Extension:', latestExtension);

  // Prepare the invoice data based on the latest extension or membership details
  const invoiceData = {
    member: member._id,
    memberName: `${member.firstName} ${member.lastName}`, 
    memberEmail: member.email,
    planName: membership.plan.name,
    planDescription: membership.plan.description,
    planPrice: membership.plan.price,
    planDuration: membership.plan.duration,
    startDate: membership.startDate,
    endDate: latestExtension ? latestExtension.newEndDate : membership.endDate, // If extension exists, use its endDate
    previousEndDate: latestExtension ? latestExtension.previousEndDate : membership.endDate,  // If no extension, previous and new endDate are the same
    extensionDuration: latestExtension ? latestExtension.duration : null,  // Duration from extension or null
  };

  // Create and save the invoice
  const invoice = new Invoice(invoiceData);
  await invoice.save();

  return res.status(201).json(new apiResponse(201, invoice, 'Invoice generated successfully'));
});