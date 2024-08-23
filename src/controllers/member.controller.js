import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Member } from "../models/member.model.js";
import { Membership } from "../models/membership.model.js";
import { Plan } from "../models/plan.model.js";
import { apiError } from "../utils/apiError.js";
//import twilio from 'twilio';

// Function to calculate end date based on duration
// const calculateEndDate = (startDate, duration) => {
//   if (isNaN(duration) || duration <= 0 || duration > 12) {
//     throw new Error("Invalid duration. Must be a number between 1 and 12 representing months.");
//   }
//   const endDate = new Date(startDate);
//   if (isNaN(endDate.getTime())) {
//     throw new Error("Invalid start date.");
//   }
//   endDate.setMonth(endDate.getMonth() + duration);
//   return endDate;
// };

const calculateEndDate = (startDate, duration) => {
  if (isNaN(duration) || duration <= 0 || duration > 12) {
    throw new Error("Invalid duration. Must be a number between 1 and 12 representing months.");
  }
  const endDate = new Date(startDate);
  if (isNaN(endDate.getTime())) {
    throw new Error("Invalid start date.");
  }

  console.log("Start Date:", endDate);
  console.log("Duration (Months):", duration);

  endDate.setMonth(endDate.getMonth() + duration);

  console.log("Calculated End Date:", endDate);

  return endDate;
};

// Register new member
export const registerMember = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, age, address, mobile, email, planId } = req.body;

  // Validate required fields
  if ([firstName, lastName, gender, age, mobile, email, planId].some(field => field === undefined || field === null || field === '')) {
    throw new apiError(400, "All fields are required");
  }

  const existingMember = await Member.findOne({
    $or: [{ mobile }, { email }]
  });

  if (existingMember) {
    throw new apiError(409, "Member with this email or mobile already exists");
  }

  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new apiError(404, "Plan not found");
  }

  // Start Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create new member
    const newMember = new Member({
      firstName, 
      lastName, 
      gender, 
      age, 
      address, 
      mobile, 
      email,
      joiningDate: new Date(),
    });

    // Save new member within the session
    await newMember.save({ session });

    // Calculate membership dates
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.duration);

    // Create new membership
    const newMembership = new Membership({
      plan: plan._id,
      startDate,
      endDate,
      status: "active",
      member: newMember._id,
    });

    // Save new membership within the session
    await newMembership.save({ session });

    // Link membership to the member
    newMember.membership = newMembership._id;
    await newMember.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Optionally, populate the membership in the response
    const savedMember = await Member.findById(newMember._id).populate('membership');

    res.status(201).json(new apiResponse(201, savedMember, "Member registered successfully"));

  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// Get all members with their associated membership and plan
export const getAllMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().populate({
      path: 'membership',
      populate: {
          path: 'plan',
          model: 'Plan'
      }
  });

  res.status(200).json(new apiResponse(200, members, "All members fetched successfully"));
});

// Get a single member with populated membership and plan
export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.memberId).populate({
      path: 'membership',
      populate: {
          path: 'plan',
          model: 'Plan'
      }
  });

  if (!member) {
      throw new apiError(404, "Member not found");
  }

  res.status(200).json(new apiResponse(200, member, "Member fetched successfully"));
});

// Update a member using PATCH
export const updateMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { email, mobile, ...updateFields } = req.body;

  const member = await Member.findById(memberId);

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  // Check if the new email or mobile already exists on a different member
  const existingMember = await Member.findOne({
    $or: [{ email }, { mobile }],
    _id: { $ne: memberId }, // Exclude the current member from the search
  });

  if (existingMember) {
    throw new apiError(409, "Member with this email or mobile already exists");
  }

  // Apply updates only to the provided fields for the member
  Object.keys(updateFields).forEach(field => {
    if (updateFields[field] !== undefined && updateFields[field] !== null) {
      member[field] = updateFields[field];
    }
  });

  await member.save();
  
  const updatedMember = await Member.findById(memberId)
      .populate({
          path: 'membership',
          populate: { path: 'plan' }  // Ensure the plan is populated
      });

  res.status(200).json(new apiResponse(200, updatedMember, "Member updated successfully"));
});




// Delete a member
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.memberId);

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  await Membership.findByIdAndDelete(member.membership);

  res.status(200).json(new apiResponse(200, {}, "Member deleted successfully"));
});

// Extend a membership or opt for a different plan
// export const extendMembership = asyncHandler(async (req, res) => {
//   const { memberId, duration, newPlanId } = req.body;
//   const adminId = req.user._id;

//   const member = await Member.findById(memberId).populate('membership');

//   if (!member) {
//     throw new apiError(404, "Member not found");
//   }

//   const currentMembership = await Membership.findById(member.membership._id);

//   if (!currentMembership) {
//     throw new apiError(404, "Membership not found");
//   }

//   if (newPlanId) {
//     // Opt for a different plan
//     const newPlan = await Plan.findById(newPlanId);
//     if (!newPlan) {
//       throw new apiError(404, "New plan not found");
//     }

//     // Deactivate current membership
//     currentMembership.status = "inactive";
//     await currentMembership.save();

//     const startDate = new Date();
//     const endDate = calculateEndDate(startDate, newPlan.duration);

//     const newMembership = new Membership({
//       plan: newPlan._id,
//       startDate,
//       endDate,
//       status: "active",
//       member: member._id,
//     });

//     await newMembership.save();

//     member.membership = newMembership._id;
//     await member.save();

//     res.status(200).json(new apiResponse(200, newMembership, "Membership updated to a new plan successfully"));
//   } else {
//     // Extend the current membership
//     const previousEndDate = currentMembership.endDate;
//     const newEndDate = calculateEndDate(previousEndDate, duration);

//     currentMembership.endDate = newEndDate;
//     currentMembership.status = "active";
//     currentMembership.extensions.push({
//       previousEndDate,
//       newEndDate,
//       extendedBy: adminId,
//       duration,
//     });

//     await currentMembership.save();

//     res.status(200).json(new apiResponse(200, currentMembership, "Membership extended successfully"));
//   }
// });

// Extend a membership or opt for a different plan
// Extend a membership or opt for a different plan
export const extendMembership = asyncHandler(async (req, res) => {
  const { memberId, duration, newPlanId } = req.body;
  const adminId = req.user._id;

  const member = await Member.findById(memberId).populate('membership');

  if (!member) {
    throw new apiError(404, "Member not found");
  }

  const currentMembership = await Membership.findById(member.membership._id);

  if (!currentMembership) {
    throw new apiError(404, "Membership not found");
  }

  if (newPlanId) {
    // Opt for a different plan
    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) {
      throw new apiError(404, "New plan not found");
    }

    // Deactivate current membership
    currentMembership.status = "inactive";
    await currentMembership.save();

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, newPlan.duration);

    const newMembership = new Membership({
      plan: newPlan._id,
      startDate,
      endDate,
      status: "active",
      member: member._id,
    });

    await newMembership.save();

    member.membership = newMembership._id;
    await member.save();

    res.status(200).json(new apiResponse(200, newMembership, "Membership updated to a new plan successfully"));
  } else {
    // Extend the current membership
    const previousEndDate = currentMembership.endDate;
    const newEndDate = calculateEndDate(previousEndDate, duration);

    currentMembership.endDate = newEndDate;
    currentMembership.status = "active";
    currentMembership.extensions.push({
      previousEndDate,
      newEndDate,
      extendedBy: adminId,
      duration,
      extendedAt: new Date(),
    });

    // Log the extensions array before saving
    console.log('Extensions before saving:', currentMembership.extensions);

    await currentMembership.save();

    // Log the extensions array after saving
    const updatedMembership = await Membership.findById(currentMembership._id);
    console.log('Extensions after saving:', updatedMembership.extensions);

    res.status(200).json(new apiResponse(200, updatedMembership, "Membership extended successfully"));
  }
});

// Find all members with active memberships
export const getActiveMembers = asyncHandler(async (req, res) => {
  const activeMemberships = await Membership.find({ status: "active" }).populate('member');

  const activeMembers = activeMemberships.map(membership => membership.member);

  res.status(200).json(new apiResponse(200, activeMembers, "All active members fetched successfully"));
});

// Find all members with inactive memberships
export const getInactiveMembers = asyncHandler(async (req, res) => {
  const inactiveMemberships = await Membership.find({ status: "inactive" }).populate('member');

  const inactiveMembers = inactiveMemberships.map(membership => membership.member);

  res.status(200).json(new apiResponse(200, inactiveMembers, "All inactive members fetched successfully"));
});

// Twilio configuration
const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
//const client = twilio(accountSid, authToken);

// Function to calculate memberships expiring in exactly 5 days
const calculateExpiringMemberships = async () => {
  const today = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(today.getDate() + 5); // Check for memberships expiring in exactly 5 days

  const expiringMemberships = await Membership.find({
    endDate: { $eq: expiryDate },
    status: "active"
  }).populate('member');

  return expiringMemberships;
};

// Method to check expiring memberships and send notifications
export const checkExpiringMemberships = async () => {
  try {
    const expiringMemberships = await calculateExpiringMemberships();

    // Implement your notification logic here, e.g., send WhatsApp messages
    expiringMemberships.forEach(membership => {
      const member = membership.member;
      console.log(`Membership for ${member.firstName} ${member.lastName} is expiring on ${membership.endDate}`);
      // Example: Send WhatsApp notification
      //sendWhatsAppNotification(member.mobile, membership);
    });

  } catch (error) {
    console.error("Error checking expiring memberships:", error);
  }
};

// Example function to send WhatsApp notification
const sendWhatsAppNotification = (mobile, membership) => {
  const message = `Dear ${membership.member.firstName},\n\nYour membership is expiring on ${membership.endDate}. Please renew it to continue enjoying our services.\n\nThank you.`;

  client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886', // Replace with your Twilio WhatsApp number
    to: `whatsapp:${mobile}`
  }).then(message => console.log('WhatsApp message sent:', message.sid))
    .catch(error => console.error('Error sending WhatsApp message:', error));
};