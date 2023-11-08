const puppeteer = require('puppeteer')
const TelegramBot = require('node-telegram-bot-api');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


const token = '6582823602:AAFN1N_aI0uXKobKXre1-MptWlSKRo8D8no';
var newNumbers = []
var storedNumbers = [];
let counter = 0;

const ratebChatID = 1631333030;
const nasser = 1462861733;
const user = 5820914876

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
  const browser = await puppeteer.launch({headless:false})
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
  var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
  async function numbersFilter() {
    if (localStorage.getItem("nums") != null) {
      storedNumbers = JSON.parse(localStorage.getItem("nums"));

      for (i of nums) {
        if (!storedNumbers.includes(i)) {
          newNumbers.push(i);
          storedNumbers.push(i)

        }
      }
      localStorage.setItem("nums", JSON.stringify(storedNumbers));
    } else {
      newNumbers = nums;
      storedNumbers = nums;
      localStorage.setItem("nums", JSON.stringify(storedNumbers));


    }
  }
  await numbersFilter()
 

  await browser.close()
  if (newNumbers.length > 0)
    await sendNotifications()


}
async function start03() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
  await Promise.all([
    page.waitForNavigation(),
    await page.$eval('#id1', el => el.value = 0),
    // await page.$eval('#num2', el => el.value = 3),
    page.click("#numbers > input[type=button]:nth-child(10)"),
    page.setViewport({
      width: 1000,
      height: 10000,
      deviceScaleFactor: 1
    })

  ]);
  var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
  async function numbersFilter() {
    if (localStorage.getItem("nums") != null) {
      storedNumbers = JSON.parse(localStorage.getItem("nums"));

      for (i of nums) {
        if (!storedNumbers.includes(i)) {
          newNumbers.push(i);
          storedNumbers.push(i)

        }
      }
      localStorage.setItem("nums", JSON.stringify(storedNumbers));
    } else {
      newNumbers = nums;
      storedNumbers = nums;
      localStorage.setItem("nums", JSON.stringify(storedNumbers));


    }
  }
  await numbersFilter()

  await browser.close()
  if (newNumbers.length > 0)
  {
    await sendNotifications()

  }


}
async function sendNotifications() {
  let c = 0
  var list = rearrangeNumbers(newNumbers);
  if (newNumbers.length > 0) {

    if (list.length > 30) {
      for (let i = 0; i < list.length; i += 30) {
        const chunk = list.slice(i, i + 30);

        // Perform an action on the chunk
        bot.sendMessage(ratebChatID, chunk.join(' '));
        // bot.sendMessage(me, 'nasser');

      }
    }

    // Handle any remaining elements
    const remaining = list.slice((Math.floor(list.length / 30)) * 30);
    if (remaining.length > 0) {
      // Perform an action on the remaining elements
      bot.sendMessage(ratebChatID, remaining.join(' '));

    }
  }





}

setInterval(() => {
  start03().then(() => {
    newNumbers = [];
    storedNumbers = [];
  })
  // start().then(() => {
  //   newNumbers = [];
  //   storedNumbers = [];
  

  // })
}, 28 * 1000);



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

