import { v4 as uuidv4 } from 'uuid';
import { Membership } from '../models/membership.model.js';
import { Invoice } from '../models/invoice.model.js';
import { apiError } from '../utils/apiError.js';

export const generateInvoice = async (member, extensionId = null) => {
  const membership = await Membership.findById(member.membership).populate('plan');

  if (!membership) {
      throw new apiError(404, 'Membership not found');
  }

  // Check if the extension exists if extensionId is provided
  let extension;
  if (extensionId) {
      extension = membership.extensions.find(ext => ext._id.toString() === extensionId.toString());
      if (!extension) {
          throw new apiError(404, 'Extension not found');
      }
  }

  // Generate a unique invoice ID
  const invoiceId = `INV-${Date.now()}-${uuidv4().slice(0, 3)}`;

  // Prepare the invoice data
  const invoiceData = {
      member: member._id,
      membership: membership._id,
      invoiceId,
      memberName: `${member.firstName} ${member.lastName}`,
      memberEmail: member.email,
      planName: membership.plan.name,
      planDescription: membership.plan.description,
      planPrice: membership.plan.price,
      planDuration: membership.plan.duration,
      startDate: membership.startDate,
      endDate: extension ? extension.newEndDate : membership.endDate, // Use extension's endDate if available
      previousEndDate: extension ? extension.previousEndDate : membership.startDate, // Use extension's previous endDate if available
      extensionDuration: extension ? extension.duration : null,  // Duration from extension
      extensionId,  // Pass extensionId if available
  };

  // Create and save the invoice
  const invoice = new Invoice(invoiceData);
  await invoice.save();

  return invoice;
};
