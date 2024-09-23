import { v4 as uuidv4 } from 'uuid';
import { Membership } from '../models/membership.model.js';
import { Invoice } from '../models/invoice.model.js';
import { apiError } from '../utils/apiError.js';

// export const generateInvoice = async (member) => {
//     // Fetch membership details
//     const membership = await Membership.findById(member.membership._id).populate('plan');
  
//     if (!membership) {
//       throw new apiError(404, 'Membership not found');
//     }
  
//     // Check for latest extension, if any
//     const latestExtension = membership.extensions.length > 0
//       ? membership.extensions[membership.extensions.length - 1]
//       : null;
  
//     // Generate a unique invoice ID
//     const invoiceId = `INV-${Date.now()}-${uuidv4().slice(0, 6)}`;
  
//     // Prepare the invoice data
//     const invoiceData = {
//       member: member._id,
//       invoiceId: invoiceId,
//       memberName: `${member.firstName} ${member.lastName}`,
//       memberEmail: member.email,
//       planName: membership.plan.name,
//       planDescription: membership.plan.description,
//       planPrice: membership.plan.price,
//       planDuration: membership.plan.duration,
//       startDate: membership.startDate,
//       endDate: latestExtension ? latestExtension.newEndDate : membership.endDate,
//       previousEndDate: latestExtension ? latestExtension.previousEndDate : membership.endDate,
//       extensionDuration: latestExtension ? latestExtension.duration : null,
//     };
  
//     // Save and return the invoice
//     const invoice = new Invoice(invoiceData);
//     await invoice.save();
  
//     return invoice;
//   };


  export const generateInvoice = async (member) => {
    const membership = await Membership.findById(member.membership).populate('plan');
  
    if (!membership) {
      throw new apiError(404, 'Membership not found');
    }
  
    // Get the latest extension if available, otherwise use membership start and end dates
    const latestExtension = membership.extensions.length > 0
      ? membership.extensions[membership.extensions.length - 1]
      : null;
  
    // Generate a unique invoice ID
    const invoiceId = `INV-${Date.now()}-${uuidv4().slice(0, 3)}`;
  
    // Prepare the invoice data based on the latest extension or membership details
    const invoiceData = {
      member: member._id,
      invoiceId: invoiceId,
      memberName: `${member.firstName} ${member.lastName}`, 
      memberEmail: member.email,
      planName: membership.plan.name,
      planDescription: membership.plan.description,
      planPrice: membership.plan.price,
      planDuration: membership.plan.duration,
      startDate: membership.startDate,
      endDate: latestExtension ? latestExtension.newEndDate : membership.endDate, // Use end date if no extension
      previousEndDate: latestExtension ? latestExtension.previousEndDate : membership.startDate, // Use start date if no extension
      extensionDuration: latestExtension ? latestExtension.duration : null,  // Duration from extension or null if none
    };
  
    // Create and save the invoice
    const invoice = new Invoice(invoiceData);
    await invoice.save();
  
    return invoice;
  };