const puppeteer=require("puppeteer");
const FCM = require('fcm-node')
const serverKey = "AAAAEW_q8QU:APA91bHH6ba2lZ-Ihw5kKw778yxH0z0Rh3vp9A5zb2iJoYTlong2Id4GuMmtwtPs_hwgczmSnZXg1iSff8sxRErwYaIHGjgEHhq0LR1XB3eSrS6_EzyyCyCMJBLrPGy7yLK11OxkRfz3"
const fcm = new FCM(serverKey)
const TelegramBot = require('node-telegram-bot-api');
const token = '6042680252:AAFG_hn6UJsfF5xSn1s39VWVc8yvrKjB2A4';
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}


const ratebChatID=1631333030;
const myChatID=1462861733;


const bot = new TelegramBot(token, {polling: true});
bot.onText(/\/echo (.+)/, (msg, match) => {
  
 
   const chatId = msg.chat.id;
   console.log(chatId);
 
   // send back the matched "whatever" to the chat
   bot.sendMessage(chatId, resp);
 });
// messages.
bot.on('message', (msg) => {
   const chatId = msg.chat.id;
 console.log(chatId)
   // send a message to the chat acknowledging receipt of their message
   bot.sendMessage(chatId, 'Received your message');
 });
let storedNumbers=[];
let newNumbers=[];

async function scrapping(){
   var browser;
   var page ;
   
   try{
      browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
      page = await browser.newPage();
          await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });

   
         await Promise.all([
            page.waitForNavigation(),
            page.click("#numbers > input[type=button]:nth-child(10)"),
            page.setViewport({
               width: 1000,
               height: 10000,
               deviceScaleFactor: 1
             })
           
          ]);
   
           var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text)});
      async function numbersFilter(){
         if (localStorage.getItem("nums") != null) {
            storedNumbers = JSON.parse(localStorage.getItem("nums"));
            
            for( i of nums){
               if(!storedNumbers.includes(i)){
                  newNumbers.push(i);
                  storedNumbers.push(i)
   
               }
            }
            localStorage.setItem("nums", JSON.stringify(storedNumbers));   
           }else{
            newNumbers=nums;
            storedNumbers=nums;
            localStorage.setItem("nums", JSON.stringify(storedNumbers));   

   
           }
      }
           await numbersFilter()
           await browser.close()
   
           
   }catch(e){
      await browser.close()



   }
   
   
}
async function sendNotifications () {

   let c = 0
   let notBody = "";
   if (newNumbers.length < 40 && newNumbers.length != 0) {
      for (let i = 0; i < newNumbers.length; i++) {
         notBody += newNumbers[i] + " ";
         if (i % 4 == 0) notBody += "\n";
      }
      bot.sendMessage(ratebChatID, notBody);



   }
   else {
      for (let i = 0; i < newNumbers.length; i++) {
         notBody += newNumbers[i] + " ";
         if (i % 5 == 0) notBody += "\n";


         if (c == 40) {
            bot.sendMessage(ratebChatID, notBody);

           
            c = 0;
            notBody = "";


         }
         c++;
      }
   }




}

let counter = 1;
setInterval(() => {
   scrapping().then(_=>{
    sendNotifications().then(_=>{
      console.log("Check Number: "+counter+"\n");
      console.log("Numbers Sent : "+newNumbers+"\n");
      console.log("Stored Numbers Length : "+storedNumbers.length+"\n");
      newNumbers=[];

    })
   })
 

}, 16000)






































































// const puppeteer = require('puppeteer');
// const fs = require("fs/promises");
// var FCM = require('fcm-node')
// var serverKey = "AAAAEW_q8QU:APA91bHH6ba2lZ-Ihw5kKw778yxH0z0Rh3vp9A5zb2iJoYTlong2Id4GuMmtwtPs_hwgczmSnZXg1iSff8sxRErwYaIHGjgEHhq0LR1XB3eSrS6_EzyyCyCMJBLrPGy7yLK11OxkRfz3"
// var fcm = new FCM(serverKey)
// if (typeof localStorage === "undefined" || localStorage === null) {
//    var LocalStorage = require('node-localstorage').LocalStorage;
//    localStorage = new LocalStorage('./scratch');
// }
// let nums = [];
// let whatsappNums = [];
// let storedNums = [];
// let getNumbers = async () => {
//    const browser = await puppeteer.launch();
//    const page = await browser.newPage();

//    try{
//       nums=[];
//       whatsappNums=[];
//       storedNums=[]

//       await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });

//       await page.click("#numbers > input[type=button]:nth-child(10)"),
//       page.setViewport({
//          width: 1000,
//          height: 10000,
//          deviceScaleFactor: 1
//        });
//          await page.waitForNavigation(),
   
//          nums = await page.evaluate(() => {
//             return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text);
//          })
//       if (localStorage.getItem("nums") != null) {
//          storedNums = JSON.parse(localStorage.getItem("nums"));
   
//          for (let i = 0; i < nums.length; i++) {
//             if (!storedNums.includes(nums[i])) { whatsappNums.push(nums[i]); storedNums.push(nums[i]) }
//          }
   
//          localStorage.setItem("nums", JSON.stringify(storedNums));
//       } else {
//          whatsappNums = nums;
//          localStorage.setItem("nums", JSON.stringify(nums));
   
//       }
   
   
//       await browser.close();
//       return new Promise(function (resolve) {
//          setTimeout(resolve, 1);
//       });
//    }catch(e){
//       console.log;
//       await browser.close();
//       return new Promise(function (resolve) {
//          setTimeout(resolve, 1);
//       });
//    }

 




// }

// let x = 0;
// setInterval(() => {
//    try{

//       getNumbers().then(() => {
//          if (whatsappNums.length != 0){
//             sendNote();
//             console.log("sent nums "+whatsappNums + "\n\n")
//             whatsappNums=[];

//          }

//          console.log("counter "+x++ + "\n"+"Stored Numbers Length "+storedNums.length+"\n");
//          storedNums=[];
//          nums=[];
//          whatsappNums=[];
   
//       })
   
//    }catch(e){

//    }

// }, 25000)

// let sendNote = ()=> {

//    let c = 0
//    let notBody = "";
//    if (whatsappNums.length < 40 && whatsappNums.length != 0) {
//       for (let i = 0; i < whatsappNums.length; i++) {
//          notBody += whatsappNums[i] + " ";
//          if (i % 4 == 0) notBody += "\n";
//       }
//       var message = {
//          // to: 'cdi2pFxpRJK1IHLS1z88hP:APA91bHLhqoMmpIFG8D6TJN-5kRlj1iXYRtGw3zS8Wp0FyVXWTWy8bYXk8D4M_VPMIG8UphZdP4PO7T8GRhVdiVwiq1cE7yyp4v16OziJA3YBZX2xey8FjruJf3MMHcnX-JhlCuaLrRR',         
//          to: 'eP5FhlLbQ_Sg4pe7U_9-DW:APA91bGhyhx5W2cXub2CoYYPpLMPGt7tgJ1QBUPkRVGkkGL5f17DnONIMp03Md5RBjdGNE-JRpNwiEdJjheIclkyzNtQKuKEXXdvuJEkOm0p4a6eKog4d0nU2Z2ZqpZrPjTqqsNvO7Td',
//          collapse_key: 'your_collapse_key',
//          notification: {
//             title: "Touch",
//             body: notBody
//          },
//          data: {
//             my_key: 'my value',
//             my_another_key: 'my another value'
//          }
//       }
//       fcm.send(message, (err, response) => {
//          if (err) {
//             console.log("Something has gone wrong!")
//          } else {
//             console.log("Successfully sent with response: ", response)
//          }
//       })


//    }
//    else {
//       for (let i = 0; i < whatsappNums.length; i++) {
//          notBody += whatsappNums[i] + " ";
//          if (i % 5 == 0) notBody += "\n";


//          if (c == 40) {
//             var message = {
//                // to: 'cdi2pFxpRJK1IHLS1z88hP:APA91bHLhqoMmpIFG8D6TJN-5kRlj1iXYRtGw3zS8Wp0FyVXWTWy8bYXk8D4M_VPMIG8UphZdP4PO7T8GRhVdiVwiq1cE7yyp4v16OziJA3YBZX2xey8FjruJf3MMHcnX-JhlCuaLrRR',         
//                to: 'eP5FhlLbQ_Sg4pe7U_9-DW:APA91bGhyhx5W2cXub2CoYYPpLMPGt7tgJ1QBUPkRVGkkGL5f17DnONIMp03Md5RBjdGNE-JRpNwiEdJjheIclkyzNtQKuKEXXdvuJEkOm0p4a6eKog4d0nU2Z2ZqpZrPjTqqsNvO7Td',
//                collapse_key: 'your_collapse_key',
//                notification: {
//                   title: "Touch",
//                   body: notBody
//                },
//                data: {
//                   my_key: 'my value',
//                   my_another_key: 'my another value'
//                }
//             }
//             fcm.send(message, (err, response) => {
//                if (err) {
//                   console.log("Something has gone wrong!")
//                } else {
//                   console.log("Successfully sent with response: ", response)
//                }
//             })
//             c = 0;
//             notBody = "";


//          }
//          c++;
//       }
//    }




// }
