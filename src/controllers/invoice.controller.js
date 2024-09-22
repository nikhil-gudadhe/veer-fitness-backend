import { Invoice } from '../models/invoice.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import { Member } from '../models/member.model.js';
import { generateInvoice } from '../utils/invoiceUtils.js';

// Create a new invoice
export const createInvoice = asyncHandler(async (req, res) => { 
  const { memberId } = req.body; 

    // Fetch the member
    const member = await Member.findById(memberId).populate('membership');
    if (!member) {
      throw new apiError(404, 'Member not found');
    }
  
    // Generate the invoice using the utility function
    const invoice = await generateInvoice(member);
  
    res.status(201).json(new apiResponse(201, invoice, 'Invoice generated successfully'));
});

// Fetch invoice by memberId
export const fetchByMemberId = asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  const member = await Member.findById(memberId)
    .populate('membership')
    .populate({
      path: 'membership',
      populate: {
        path: 'extensions',
        options: { limit: 5, sort: { extendedAt: -1 } }, // Fetch only the 5 most recent extensions
      },
    });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  console.log("Member: ", member);
  res.status(200).json(member);
});


export const fetchInvoiceByMemberId = asyncHandler(async (req, res) => {
    const { memberId } = req.params;
  
    // Find the member and slice the extensions to the last 5
    const member = await Member.findById(memberId)
      .populate({
        path: 'membership',
        populate: {
          path: 'plan',
        },
        select: {
          // Apply slice on the extensions array
          extensions: { $slice: -5 }, // Retrieve the last 5 extensions
        }
      });
  
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
  
    res.status(200).json(member);
  });
  