const translate = require('@vitalets/google-translate-api');
const express = require('express');
const app = express();
const wa = require('@open-wa/wa-automate');

const fs = require('fs');

wa.ev.on('qr.**', async (qrcode,sessionId) => {
  //base64 encoded qr code image
  const imageBuffer = Buffer.from(qrcode.replace('data:image/png;base64,',''), 'base64');
  fs.writeFileSync(`qr_code${sessionId?'_'+sessionId:''}.png`, imageBuffer);
});
wa.create({
  sessionId: "COVID_HELPER",
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  timeout: 10000,
  waitUntil: 'networkidle0',
  executablePath: '/usr/bin/chromium-browser',
  args: [
       "--no-sandbox",
       "--disable-gpu",
       ],
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));


let translated;

function start(client) {
  client.onMessage(async message => {
    console.log(message);
    if (message.body.toUpperCase() === 'HI') {
      await client.sendText(message.from, '👋 Hello!');
    }
    else if (message.body.toUpperCase() === 'HI BOT') {
      await client.sendText(message.from, '👋 Hello!\n🤩 Glad You Call on Me!\n\nBy the way, I\'m thinking to beat Google translate! 😁\n\n You could ask me any Word or Sentence to Translate like bellow :\n\n=> Just add \"bn\" in front of your Word or Sentence to translate into Bengali.\n\n=> Or add \"en\" in front of your Word or Sentence translate into English.');
    }
   else if (message.body.toLowerCase().startsWith("bn ")) {
     await translate(message.body.substr(message.body.indexOf(" ") + 1) , {to: "bn"},
              {options : {
                 raw : true
              }}).then(res => {
    translated = res;
    
}).catch(err => {
    console.error(err);
    
    (async() => {
      await client.sendText(message.from, "Something Wrong Happened!\nTry Again!");
    })();
    
});

let translateExtra = "";
let simillarWords = "";
let wordDefinition = "";

console.log(translated.raw)
//let data = JSON.stringify(translated.raw);
//fs.writeFileSync('translate-raw.json', data);
if (translated.raw[3]){
  if (translated.raw[3][1]) {
    const wordType = translated.raw[3][0].toUpperCase() + " is a " + translated.raw[3][1][0][0][0];
    const wordDefinitionActual = "Definition : " + translated.raw[3][1][0][0][1][0][0];
    wordDefinition = "\n---------------------------------------\n" + wordType + "\n" + wordDefinitionActual;
if (translated.raw[3][5]) {
  const similarWordArray = translated.raw[3][5][0][0][1]
let simillarWordsPre = ""
similarWordArray.forEach(simillarWordFunction);
function simillarWordFunction (similarWordArray, index) {
   simillarWordsPre += similarWordArray[0] +" : "+ similarWordArray[2][0] + ";\n";
  }
  simillarWords = "\n\n--------Similar Words--------\n" + simillarWordsPre;
}
translateExtra = wordDefinition + simillarWords;

}
};
translateRes = "Meaning: " + translated.text + translateExtra; 
await client.sendText(message.from, translateRes);
}      
      
   else if (message.body.toLowerCase().startsWith("en ")) {
     await translate(message.body.substr(message.body.indexOf(" ") + 1) , {to: "en"},
              {options : {
                 raw : true
              }}).then(res => {
    translated = res;
     //  let data = JSON.stringify(res.raw);
//fs.writeFileSync('translate-en-raw.json', data);
    
}).catch(err => {
    console.error(err);
});

let translateExtra = "";
let simillarWords = "";
let wordDefinition = "";

console.log(translated.raw)
let data = JSON.stringify(translated.raw);
fs.writeFileSync('translate-raw.json', data);
if (translated.raw[3]){
  if (translated.raw[3][1]) {
    
  
    const wordType = translated.raw[3][0].toUpperCase() + " is a " + translated.raw[3][1][0][0][0];
    const wordDefinitionActual = "Definition : " + translated.raw[3][1][0][0][1][0][0];
    wordDefinition = "\n---------------------------------------\n" + wordType + "\n" + wordDefinitionActual;
if (translated.raw[3][5]) {
  const similarWordArray = translated.raw[3][5][0][0][1]
let simillarWordsPre = ""
similarWordArray.forEach(simillarWordFunction);
function simillarWordFunction (similarWordArray, index) {
   simillarWordsPre += similarWordArray[0] +" : "+ similarWordArray[2][0] + ";\n";
  }
  simillarWords = "\n\n--------Similar Words--------\n" + simillarWordsPre;
}
translateExtra = wordDefinition + simillarWords;
}
};
translateRes = "Meaning: " + translated.text + translateExtra; 
await client.sendText(message.from, translateRes);
};      
      
      
      
    
  });
};




/*
app.get('/:ln/:text', async function (req, res) {
 
    await translate(req.params['text'], {to: req.params['ln']}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
    translated = res.text;
}).catch(err => {
    console.error(err);
 
  
});
  
  
  
  
  res.send(translated)
})
 
app.listen(3000)
*/