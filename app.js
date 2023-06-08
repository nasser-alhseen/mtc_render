const puppeteer = require('puppeteer')
const Number = require('./number')
const mongoose = require('mongoose')
const TelegramBot = require('node-telegram-bot-api');


const token = '5990127857:AAG9JsQ06wwXJWK9Jdymp_j5h80cQDYIYOI';
var newNumbers = []
var storedNumbers = [];
let counter = 0;

const ratebChatID = 1631333030;
const nasser = 1462861733;
const bot = new TelegramBot(token, { polling: true });


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

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
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
    var scrappedNumbers = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
    var dbNumbers = await Number.find();
    storedNumbers = [];
    for (i in dbNumbers) {
        storedNumbers.push(dbNumbers[i].number);
    }

    const unique1 = scrappedNumbers.filter(x => !storedNumbers.includes(x)); // [1, 2]
    const unique2 = storedNumbers.filter(x => !scrappedNumbers.includes(x)); // [6, 7]
    // [1, 2, 6, 7]
    newNumbers = unique1.concat(unique2);
    console.log(newNumbers);
    var objNums = [];
    for (i in newNumbers) {
        objNums.push({ number: newNumbers[i] })
    }
    await Number.insertMany(objNums);


    await browser.close()
    await sendNotifications()

}
async function sendNotifications() {
    let c = 0
    var list=newNumbers;
  if(newNumbers.length>0){
    // newNumbers.forEach((ele)=>{
    //     if(typeof ele==='string'&&ele.length==8)list.push(ele);
    // })
    console.log("Telegram")
    list.sort((a, b) => a - b);

    for (let i = 0; i < list.length; i += 30) {
        const chunk = list.slice(i, i + 30);
        
        // Perform an action on the chunk
        bot.sendMessage(ratebChatID, chunk.join(' '));
        // bot.sendMessage(me, 'nasser');

    }
      
      // Handle any remaining elements
      const remaining = list.slice((Math.floor(list.length / 30)) * 30);
      if (remaining.length > 0) {
        // Perform an action on the remaining elements
        bot.sendMessage(ratebChatID, remaining.join(' '));

    }
  }





}

mongoose.connect("mongodb://127.0.0.1/mtc").then(_ => {
    try {
        setInterval(start, 18 * 1000);

    } catch (error) {
        console.log(error)
    }


    // setInterval(()=>{
    //     start().then(_=>{
    //         sendNotifications().then(_=>{
    //             console.log("Check Number: "+counter+"\n");
    //             console.log("Numbers Sent : "+newNumbers+"\n");
    //             console.log("Stored Numbers Length : "+storedNumbers.length+"\n");
    //             newNumbers=[];
    //             storedNumbers=[]
    //             counter++;

    //           })
    //     },17000)
    // })
})
function rearrangeNumbers(numbers) {
  // Convert the numbers to an array of strings
  const nums = numbers.map(Number);

  // Sort the numbers in ascending order
  nums.sort((a, b) => a - b);

  // Initialize variables
  let prevNum = nums[0];
  let currGroup = [prevNum];
  let groups = [currGroup];

  // Group the numbers based on proximity to each other
  for (let i = 1; i < nums.length; i++) {
    const currNum = nums[i];
    const diff = currNum - prevNum;

    if (diff <= 1) {
      currGroup.push(currNum);
    } else {
      currGroup = [currNum];
      groups.push(currGroup);
    }

    prevNum = currNum;
  }

  // Flatten the groups into a single array
  const result = groups.reduce((acc, group) => acc.concat(group), []);

  // Return the rearranged numbers as a string
  return result
}


