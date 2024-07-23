import cron from 'node-cron';
import { checkExpiringMemberships } from './controllers/member.controller.js';

// Schedule a job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running a job at midnight to check for memberships expiring in 5 days');
  await checkExpiringMemberships();
});