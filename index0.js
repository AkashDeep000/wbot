 const cron = require('node-cron');
 
 
 //Send independent Day
  cron.schedule('1 21 14 AUG *', () => {
      
      console.log('running a task');
},
 {
   scheduled: true,
   timezone: "Asia/Calcutta"
 });