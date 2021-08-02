var cron = require('node-cron');

 cron.schedule('43 12 * * *', () => {
   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
 }, {
   scheduled: true,
   timezone: "Asia/Calcutta"
 });