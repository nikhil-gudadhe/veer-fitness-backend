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

  // Find the member and limit to the last 5 extensions
  const member = await Member.findById(memberId)
    .populate({
      path: 'membership',
      populate: {
        path: 'plan',
      },
      select: {
        extensions: { $slice: -5 }, // Retrieve the last 5 extensions
      }
    });

  if (!member) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Get the last 5 extensions' IDs
  const extensionIds = member.membership?.extensions.map(extension => extension._id);

  // Fetch invoices for the retrieved extensions
  const invoices = await Invoice.find({ extensionId: { $in: extensionIds } });

  // Return the member data and associated invoices
  res.status(200).json({
    member,
    invoices, // Return the invoices associated with the last 5 extensions
  });
});
  
  // Controller method to delete all invoices
export const deleteAllInvoices = asyncHandler(async (req, res) => {
  try {
      const result = await Invoice.deleteMany({}); // Delete all documents in the Invoice collection
      res.status(200).json({
          success: true,
          message: 'All invoices have been deleted successfully',
          deletedCount: result.deletedCount // Returns the number of deleted documents
      });
  } catch (error) {
      throw new apiError(500, 'Error deleting invoices');
  }
});