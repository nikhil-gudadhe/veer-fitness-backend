import { Invoice } from '../models/invoice.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { Member } from '../models/member.model.js';
import { Membership } from '../models/membership.model.js';

// Create a new invoice
export const createInvoice = asyncHandler(async (req, res) => { 
    const { memberId, extensionId } = req.body;

    const member = await Member.findById(memberId).populate('membership');
  
    if (!member) {
      throw new apiError(404, 'Member not found');
    }
  
    const membership = await Membership.findById(member.membership._id).populate('plan');
  
    if (!membership) {
      throw new apiError(404, 'Membership not found');
    }
  
    // Get the latest extension or membership details
    let extension = null;
    if (extensionId) {
      extension = membership.extensions.find(ext => ext._id.toString() === extensionId);
      if (!extension) {
        throw new apiError(404, 'Extension not found');
      }
    }
  
    // Prepare the invoice data
    const invoiceData = {
      member: member._id,
      planName: membership.plan.name,
      planDescription: membership.plan.description,
      planPrice: membership.plan.price,
      planDuration: membership.plan.duration,
      startDate: membership.startDate,
      endDate: membership.endDate,
      previousEndDate: extension ? extension.previousEndDate : membership.endDate, // Use extension if available
      newEndDate: extension ? extension.newEndDate : null,
      extensionDuration: extension ? extension.duration : null,
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();
  
    return res.status(201).json(new apiResponse(201, invoice, 'Invoice generated successfully'));
  });