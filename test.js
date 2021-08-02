var cron = require('node-cron');

 cron.schedule('56 11 * * *', () => {
   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
 }, {
   scheduled: true,
   timezone: "Asia/Calcutta"
 })