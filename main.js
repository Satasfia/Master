const { toHTML } = require('@telegraf/entity')
const { parse } = require('node-html-parser');
const options = ['Welcome Message','Bonus','Refer','Withdraw','Currency','Add Tasks','Broad Speed','Add Check','Remove Check','Withdraw Settings','Add Admin','Remove Admin','Bot Off Text','On / Off Bot']
const withdraw_options = ['Auto Network','Auto Token','Manual','Key','Address','Contract','RPC Url','Block-Chain Url','Payout Channel','Create Wallet','⬅️ Back']
let he = require('he');
const Web3 = require('web3')
const fs = require('fs');
if (!fs.existsSync('db')) {
	fs.mkdirSync('db');
}
const { Telegraf, session, Scenes} = require('telegraf');
let data = readDataFromFile()

function readDataFromFile() {
    const rawData = fs.readFileSync('./data.json');
    return JSON.parse(rawData);
}
const { BaseScene, Stage } = Scenes
const {enter, leave} = Stage
const Scene = BaseScene
const stage = new Stage();
const path = require('path'); 
const Web3js = new Web3(new Web3.providers.HttpProvider(data.rpc))
const bot = new Telegraf(data.bot_token)
console.log(data.payout)
let botStartTime = new Date().getTime();
bot.launch()
  console.log('Bot is running...');
bot.use(session())
bot.use(stage.middleware())
const bonuss = new Scene('bonuss')
stage.register(bonuss)
const currency = new Scene('currency')
stage.register(currency)
const rpcurl = new Scene('rpcurl')
stage.register(rpcurl)
const blockurl = new Scene('blockurl')
stage.register(blockurl)
const key = new Scene('key')
stage.register(key)
const addr = new Scene('addr')
stage.register(addr)
const contract = new Scene('contract')
stage.register(contract)
const payout = new Scene('payout')
stage.register(payout)
const broad = new Scene('broad')
stage.register(broad)
const acheck = new Scene('acheck')
stage.register(acheck)
const rcheck = new Scene('rcheck')
stage.register(rcheck)
const botoff = new Scene('botoff')
stage.register(botoff)
const referam = new Scene('referam')
stage.register(referam)
const minwd = new Scene('minwd')
stage.register(minwd)
const addadmin = new Scene('addadmin')
stage.register(addadmin)
const rmvadmin = new Scene('rmvadmin')
stage.register(rmvadmin)
const welcomemsg = new Scene('welcomemsg')
stage.register(welcomemsg)
const bonusam= new Scene('bonusam')
stage.register(bonusam)
const address = new Scene('address')
stage.register(address)
const task2 = new Scene('task2')
stage.register(task2)
const task3 = new Scene('task3')
stage.register(task3)
const getMsg = new Scene('getMsg')
stage.register(getMsg)
const onWithdraw = new Scene('onWithdraw')
stage.register(onWithdraw)


bot.on('message', async (ctx,next) => {
  const updateTimestamp = ctx.message.date * 1000; // Convert to milliseconds
  if (ctx.chat.type != 'private' || updateTimestamp < botStartTime) {
    console.log('Ignoring old cmds');
    return;
  }
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
if(data.bot || data.bot_admin.includes(ctx.from.id)){
await next();
}else{
ctx.replyWithHTML(data.bot_text)
}
});

const botStart = async (ctx) => {
  try {

    if (ctx.message.chat.type != 'private') {
      return
    }
const udata = await getUserData(ctx.from.id) 
    if (!udata.bal) {
      if (ctx.startPayload && ctx.startPayload != ctx.from.id) {
        let ref = ctx.startPayload * 1
        udata.pendref = ref
bot.telegram.sendMessage(ref,'<a href="tg://user?id='+ctx.from.id+'"><b>'+he.encode(ctx.from.first_name)+'</b></a> <b>Has started bot with your refer link.</b>\n<i>You will be rewarded when he complete his registration</i>',{parse_mode:'html'})
     }
udata.bal = data.bonus
udata.ref = []
await saveUserData2(ctx.from.id, udata) 
}
const msg = he.encode(data.welcome)
ctx.reply(data.welcome, {parse_mode:'html',disable_web_page_preview:true,reply_markup:{inline_keyboard:[[{text:'✅ Join Airdrop',callback_data:'next'}]]}})
  } catch (e) {
    sendError(e, ctx)
  }
}

bot.start(botStart)

bot.action('next',async (ctx) =>{
    try{
for(const a of data.check){
try{
var botStatus = await bot.telegram.getChatMember(a, bot.botInfo.id);
}catch(error){
ctx.replyWithMarkdown('*Bot is not admin in '+a+'*')
}
let res = await bot.telegram.getChatMember(a, ctx.from.id)
let result = res.status
    if (result !== 'creator' && result !== 'administrator' && result !== 'member'){
ctx.replyWithMarkdown('*Must Join All Channels First*')
return
}
}
      ctx.deleteMessage();
      ctx.replyWithMarkdown(''+data.task+'',{disable_web_page_preview:true})
      ctx.scene.enter('task2') 
  } catch (err) {
    sendError(err, ctx)
  }
})
task2.on('text', async ctx =>{
	if(ctx.message.text.length>=5 && ctx.message.text.includes("@")){
		const udata = await getUserData(ctx.from.id)
		udata.twitter = ctx.message.text
        await saveUserData(ctx.from.id,udata)
        ctx.scene.leave();
		ctx.replyWithMarkdown(data.task2, {disable_web_page_preview:true})
		ctx.scene.enter('task3')
		}else{
			ctx.replyWithMarkdown('❌*Invalid Username. Please Submit Again*')
			}
			})
task3.on('text', async ctx =>{
	if(ctx.message.text.length>=5 && ctx.message.text.includes("@")){
		const udata = await getUserData(ctx.from.id)
		udata.twitter = ctx.message.text
        await saveUserData(ctx.from.id,udata)
        ctx.scene.leave();
		ctx.replyWithMarkdown(data.address, {disable_web_page_preview:true})
		ctx.scene.enter('address')
		}else{
			ctx.replyWithMarkdown('❌*Invalid Username. Please Submit Again*')
			}
			})
address.on('text', async ctx => {
if(ctx.message.text.length>=15 ){
		ctx.scene.leave();
		const udata = await getUserData(ctx.from.id) 
udata.address = ctx.message.text
await saveUserData(ctx.from.id, udata)
 if(udata.pendref){
   const id = udata.pendref
   const data2 = await getUserData(udata.pendref) 
   bot.telegram.sendMessage(udata.pendref, '*🎯 A New Referral has registeted the bot using your referral link :* ['+ctx.from.first_name+'](tg://user?id='+ ctx.from.id+')', {parse_mode:'markdown'})
   udata.address = ctx.message.text
   udata.invited = udata.pendref
   delete udata.pendref
   data2.bal += data.reffer_bonus*1
   if(!data2.ref) {
   	data2.ref = []
   }
   data2.ref.push(ctx.from.id) 
   await saveUserData(ctx.from.id, udata) 
   await saveUserData(id, data2) 
}
ctx.replyWithMarkdown('*🎉 Welcome In Our '+data.bot_cur+' Airdrop*',{disable_web_page_preview:true,reply_markup:{keyboard:data.but,resize_keyboard:true}})
}else{
			ctx.replyWithMarkdown('*Not Valid Address*')
			}
			})
bot.hears('📊 Statistics', check, async ctx => {
const directory = path.join(__dirname, './db');
let userData = await getAllUserData();
const data = await getUserData(ctx.from.id) 
    const position = await getUserPosition(userData,ctx.from.id)
const inv = data.invited ? '<a href = "tg://user?id='+data.invited+'"><b>'+data.invited+'</b></a>' : '<b>N/A</b>'
ctx.reply(`<b>👋Hello <a href = "tg://user?id=${ctx.from.id}"><b>${he.encode(ctx.from.first_name)}</b></a> Here is your statistics </b>

<b>===============================
🔗 You are invited by</b> ${inv}
<b>👫 Referral :</b> ${data.ref.length}
<b>📊 Airdrop balance:</b> ${data.bal}
<b>🏆 Your position:</b> ${position}
<b>🙇‍♀️ Your personal referral link:</b> <code>https://t.me/${bot.botInfo.username}?start=${ctx.from.id}</code>

<b>===============================

👨‍✈️ Telegram:</b> <a href = "tg://user?id=${ctx.from.id}"><b>${ctx.from.id}</b></a>
<b>🔹 Mail: ${data.twitter}</b>
<b>📥 Wallet: </b> <code>${data.address}</code>

<b><i>‼️ If your submitted data wrong then you can restart the bot and resubmit the data again by clicking /start before airdrop end.</i></b>`,{parse_mode:'HTML',disable_web_page_preview:true})
	})
bot.hears('✅ Useful Links', check, async ctx => {
	ctx.replyWithMarkdown(data.useful,{disable_web_page_preview:true})
  })
bot.hears('ℹ️ Information', async ctx =>{
  ctx.replyWithMarkdown(data.about,{disable_web_page_preview:true})
  })
bot.hears('/Top', async (ctx , next) => {
  if(data.bot_admin.includes(ctx.from.id)){
 const allUserData = await getAllUserData();
let text= '<b>🏆 The Leaderboard Of Top 20 Reffers:</b>\n\n';
  if (allUserData.length > 0) {
    const topUsers = await getTopUsers(allUserData);
    topUsers.forEach((userData, index) => {
      text += `<b>#${index + 1}:</b> <a href = "tg://user?id=${userData.user_id}"><b>${userData.user_id}</b></a> : <b>Refers</b> <code>${userData.data.ref.length}</code>\n`;
    });
    ctx.replyWithHTML(text)
  } else {
    ctx.replyWithMarkdown('No user data found.');
  }
  }
});
bot.command('broad', (ctx) => {
if(data.bot_admin.includes(ctx.from.id)){
ctx.scene.enter('getMsg')}
})

getMsg.enter((ctx) => {
  ctx.replyWithMarkdown(
    ' *Okay Admin 👮‍♂, Send your broadcast message*'
  )
})

getMsg.leave((ctx) =>{ctx.scene.leave();})

getMsg.hears('⬅️ Back', (ctx) => {ctx.scene.leave('getMsg')})

getMsg.on('text', (ctx) => {
ctx.scene.leave('getMsg')

let postMessage = ctx.message.text
if(postMessage.length>3000){
return ctx.reply('Type in the message you want to sent to your subscribers. It may not exceed 3000 characters.')
}else{
globalBroadCast(ctx,ctx.from.id)
}
})

async function globalBroadCast(ctx,userId){
let perRound = 20000;
let totalBroadCast = 0;
let totalFail = 0;
const totalUsers = getUserIdsFromDataFolder();
let postMessage = await toHTML(ctx.message)
let noOfTotalUsers = totalUsers.length;
let lastUser = noOfTotalUsers - 1;
ctx.reply('Your message is queued and will be posted to all of your subscribers soon. Your total subscribers: '+noOfTotalUsers)
 for (const userId of totalUsers) {
    try {
    	bot.telegram.sendMessage(userId, postMessage,{parse_mode:'html'}).catch((e) => {
if(e == 'Forbidden: bot was block by the user'){
totalFail++
}
})
} catch (error) {
      console.error(`Failed to forward message to user ${userId}: ${error.message}`);
      totalFail++;
    }
    await sleep(data.broad_speed);
  }
  let totalSent = totalUsers.length - totalFail
  bot.telegram.sendMessage(ctx.from.id, '<b>Your message has been posted to all of your subscribers.</b>\n\n<b>Total User:</b> '+totalUsers.length+'\n<b>Total Sent:</b> '+totalSent+'\n<b>Total Failed:</b> '+totalFail, {parse_mode:'html'});

}

bot.hears('/stat', async (ctx) => {
try {
const userFiles = fs.readdirSync('./db');
ctx.replyWithMarkdown('*Total : '+userFiles.length+' Users*')
 } catch (err) {
    console.log(err)
  }
})
bot.hears('📤 Withdraw', check, async (ctx) => {
try {
const data = readDataFromFile()
const udata = await getUserData(ctx.from.id) 
const bal = udata.bal
let wallet = udata.address
if(udata.bal<data.min_wd){
ctx.reply('*🔐 To withdraw, you need to complete the following missions:\n\n👥 Atleast '+data.min_wd+' '+data.bot_cur+' in Balance\n🌀 Status:* '+bal.toFixed(4)+' / '+data.min_wd+'',{parse_mode:'markdown',})
return
}
ctx.reply('*📤 Enter the amount to be withdrawn to your wallet*\n\n*Address*\n`'+wallet+'`\n\n*Available for withdrawal*\n`'+bal.toFixed(4)+' '+data.bot_cur+'`', { parse_mode:'markdown',reply_markup: { keyboard:[['Back 🔙']],resize_keyboard:true}})
ctx.scene.enter('onWithdraw')
} catch (err) {
    sendError(err, ctx)
  }
})
bot.hears('Back 🔙', check, async ctx =>{
  ctx.replyWithMarkdown('_Welcome Back_',{disable_web_page_preview:true,reply_markup:{keyboard:data.but,resize_keyboard:true}})
  })
onWithdraw.on('text', async ctx => {
	try{
		ctx.scene.leave();
const botdata = readDataFromFile()
const Web3js = new Web3(new Web3.providers.HttpProvider(botdata.rpc))
 const udata = await getUserData(ctx.from.id) 
 const bal = udata.bal
var msg = ctx.message.text
 if(msg=='Back 🔙'){
 	ctx.replyWithMarkdown('_Welcome Back_',{disable_web_page_preview:true,reply_markup:{keyboard:botdata.but,resize_keyboard:true}})
		return
}
if(!isNumeric(ctx.message.text)){
 ctx.replyWithMarkdown("❌ _Send a value that is numeric or a number_",{reply_markup:{keyboard:botdata.but,resize_keyboard:true}})
 return
 }
if((ctx.message.text*1>udata.bal) | ( ctx.message.text*1<botdata.min_wd)){
ctx.replyWithMarkdown("😐 Send a value less than "+bal.toFixed(8)+" "+botdata.bot_cur+" and greater than "+botdata.min_wd+" "+botdata.bot_cur+"",{parse_mode:'markdown',reply_markup:{keyboard:botdata.but,resize_keyboard:true}})
return
 }
 if (bal >= botdata.min_wd && msg*1 >= botdata.min_wd && msg*1 <= bal) {
 	udata.bal -= msg*1
await saveUserData(ctx.from.id, udata) 
const amo = msg
const id = ctx.from.id
const am = amo	 
let wallet = udata.address
var toAddress = wallet

    ctx.replyWithMarkdown('*Withdraw Request Successfully Sent*',{disable_web_page_preview:true,reply_markup:{keyboard:botdata.but,resize_keyboard:true}})
if(botdata.with_type=='manual'){
var payText = '<code>'+wallet+','+am+'</code>'
bot.telegram.sendMessage(botdata.payout,payText,{parse_mode:'html'})
}else if(botdata.with_type=='auto-token'){
    setTimeout(() => {
const privateKey = botdata.key
let fromAddress = botdata.address2
let tokenAddress = botdata.contract
let contractABI = [
   
   {
       'constant': false,
       'inputs': [
           {
               'name': '_to',
               'type': 'address'
           },
           {
               'name': '_value',
               'type': 'uint256'
           }
       ],
       'name': 'transfer',
       'outputs': [
           {
               'name': '',
               'type': 'bool'
           }
       ],
       'type': 'function'
   }
]
let contract = new Web3js.eth.Contract(contractABI, tokenAddress, { from: fromAddress })
const amountInWei = amo* (10 ** botdata.deci);

// Convert the amount to hexadecimal
const amount = Web3js.utils.toHex(amountInWei)
//let amount = Web3js.utils.toHex(Web3js.utils.toWei(amo)); 
let data = contract.methods.transfer(toAddress, amount).encodeABI()
sendErcToken()
function sendErcToken() {
   let txObj = {
       gas: Web3js.utils.toHex(100000),
       "to": tokenAddress,
       "value": "0x00",
       "data": data,
       "from": fromAddress
   }
   Web3js.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
       if (err) {
           return callback(err)
       } else {
           console.log(signedTx)
           return Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
           	if (err) {
                   console.log(err)
               } else {
                   console.log(res)
	var hash = signedTx.transactionHash
 var payText= '<b><u>🚀 New Withdrawal Paid!</u>\n\n🔰 User :</b> <a href="tg://user?id='+ctx.from.id+'"><b>'+ctx.from.first_name+'</b></a>\n<b>🔎Address :</b> <code>'+wallet+'</code>\n<b>💲 Amount : '+amo+' $'+botdata.bot_cur+'</b>\n<b>Payout Hash</b>: <a href="'+botdata.block_url+''+hash+'"><b>'+hash+'</b></a>\n\n<b>🔃 Bot Link : @'+bot.botInfo.username+'</b>'
  bot.telegram.sendMessage(''+botdata.payout+'',payText,{parse_mode:'html'})
 ctx.reply('*Withdraw Successful\n🏧 Transaction Hash :* ['+hash+']('+botdata.block_url+''+hash+')', {parse_mode:'markdown', reply_markup:{inline_keyboard:[]}})
bot.telegram.sendMessage(id,`*Your Withdraw of *`+amo+` *${botdata.bot_cur} has been paid to your given wallet address* `, {parse_mode:'Markdown'})
}
})
}
})
}
},10000)
}else if(botdata.with_type=='auto-network'){
setTimeout(()=> {
const privateKey = botdata.key
let fromAddress = botdata.address2

let contractABI = [

   {
       'constant': false,
       'inputs': [
           {
               'name': '_to',
               'type': 'address'
           },
           {
               'name': '_value',
               'type': 'uint256'
           }
       ],
       'name': 'transfer',
       'outputs': [
           {
               'name': '',
               'type': 'bool'
           }
       ],
       'type': 'function'
   }
]
let amount = Web3js.utils.toHex(Web3js.utils.toWei(amo));
sendErcToken()
function sendErcToken() {
   let txObj = {
       gas: Web3js.utils.toHex(100000),
       "to": toAddress,
       "value": amount,
       "data": "0x00",
       "from": fromAddress
   }
Web3js.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
       if (err) {
           return callback(err)
       } else {
           console.log(signedTx)
           return Web3js.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
                if (err) {
                   console.log(err)
               } else {
                   console.log(res)
                var hash = signedTx.transactionHash
  var payText= '<b><u>🚀 New Withdrawal Paid!</u>\n\n🔰 User :</b> <a href="tg://user?id='+ctx.from.id+'"><b>'+ctx.from.first_name+'</b></a>\n<b>🔎Address :</b> <code>'+wallet+'</code>\n<b>💲 Amount : '+amo+' $'+botdata.bot_cur+'</b>\n<b>Payout Hash</b>: <a href="'+botdata.block_url+''+hash+'"><b>'+hash+'</b></a>\n\n<b>🔃 Bot Link : @'+bot.botInfo.username+'</b>'
bot.telegram.sendMessage(''+botdata.payout+'',payText,{parse_mode:'html'})
  ctx.reply('*Withdraw Successful\n🏧 Transaction Hash :* ['+hash+']('+botdata.block_url+''+hash+')', {parse_mode:'markdown', reply_markup:{inline_keyboard:[]}})
bot.telegram.sendMessage(id,`*Your Withdraw of *`+amo+` *${botdata.bot_cur} has been paid to your given wallet address* `, {parse_mode:'Markdown'})
}

})
}
})
}
},10000)
}
}else{
 ctx.replyWithMarkdown("😐 Send a value over *"+botdata.min_wd+" "+botdata.bot_cur+"* but not greater than *"+bal.toFixed(8)+" "+botdata.bot_cur+"* ",{reply_markup:{keyboard:botdata.but,resize_keyboard:true}})
ctx.scene.leave('onWithdraw')
return
 }
} catch (err) {
    sendError(err, ctx)
  }
})
bot.command('admin',async ctx => {
if(data.bot_admin.includes(ctx.from.id)){
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Welcome admin :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
}
})
bot.action(/adhymn_/,async ctx => {
const edit = ctx.callbackQuery.data.split('_')[1]
if(edit=='welcome-message'){
ctx.editMessageText('Ok good, send me a new already formatted welcome text')
ctx.scene.enter('welcomemsg')
}
if(edit=='bonus'){
ctx.editMessageText('Ok good, send me new signup bonus amount')
ctx.scene.enter('bonuss')
}
if(edit=='refer'){
ctx.editMessageText('Ok good, send me new refer amount')
ctx.scene.enter('referam')
}
if(edit=='withdraw'){
ctx.editMessageText('Ok good, send me new minimum withdraw amount')
ctx.scene.enter('minwd')
}
if(edit=='add-admins'){
ctx.editMessageText('Ok good, send me user id of user whom you wanna promote as admin')
ctx.scene.enter('addadmin')
}
if(edit=='broad-speed'){
ctx.editMessageText('Ok good, send me to how much users you wanna send broadcast per sec.')
ctx.scene.enter('broad')
}
if(edit=='remove-admin'){
ctx.editMessageText('Ok good, send me user id of user whom you wanna demote from admin')
ctx.scene.enter('rmvadmin')
}
if(edit=='key'){
ctx.editMessageText('Ok good, send me your private key')
ctx.scene.enter('key')
}
if(edit=='address'){
ctx.editMessageText('Ok good, send me your wallet address')
ctx.scene.enter('addr')
}
if(edit=='currency'){
ctx.editMessageText('Ok good, send me currency name')
ctx.scene.enter('currency')
}
if(edit=='rpc-url'){
ctx.editMessageText('Ok good, send me RPC url')
ctx.scene.enter('rpcurl')
}
if(edit=='block-chain-url'){
ctx.editMessageText('Ok good, send me Block-Chain URL')
ctx.scene.enter('blockurl')
}
if(edit=='contract'){
ctx.editMessageText('Ok good, send me your contract address')
ctx.scene.enter('contract')
}
if(edit=='payout-channel'){
ctx.editMessageText('Ok good, send me your payout channel user with @')
ctx.scene.enter('payout')
}
if(edit=='create-wallet'){
const web3 = new Web3('https://polygon-rpc.com/')
  const accd = web3.eth.accounts.create();
  var fk = accd.privateKey;
  var ad = accd.address;
ctx.replyWithMarkdown('*Here is your new wallet created:-*\n\n*Private Key:* `'+fk+'`\n*Address:* `'+ad+'`')
}
if(edit=='on-/-off-bot'){
let bott = ''
if(!data.bot){
data.bot = true
bott = 'Turned On'
}else{
data.bot = false
bott = 'Turned Off'
}
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.editMessageText('*Bot Has '+bott+' :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows},parse_mode:'markdown'})
}
if(edit=='⬅️-back'){
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.editMessageReplyMarkup({inline_keyboard:rows})
}
if(edit=='withdraw-settings'){
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.editMessageReplyMarkup({inline_keyboard:rows})
}
if(edit=='auto-network' || edit=='auto-token' || edit=='manual'){
data.with_type = edit
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.editMessageReplyMarkup({inline_keyboard:rows})
}
if(edit=='bot-off-text'){
ctx.editMessageText('Ok good, give me text to send to users when bot is off')
ctx.scene.enter('botoff')
}
if(edit=='add-check'){
ctx.editMessageText('Ok good, give me channel username to add in check')
ctx.scene.enter('acheck')
}
if(edit=='remove-check'){
ctx.editMessageText('Ok good, give me channel username to add in check')
ctx.scene.enter('rcheck')
}
})
bonuss.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid Amount*')
return
}
data.bonus = am*1
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''}))
const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*SignUp Bonus  Amount Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
referam.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid Amount*')
return
}
data.reffer_bonus = am*1
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Refer Amount Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})

minwd.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid Amount*')
return
}
data.min_wd = am*1
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Minimum Withdraw Amount Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
bonusam.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid Amount*')
return
}
data.bonus = am*1
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Welcome Bonus Amount Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
broad.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text*1
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid Amount*')
return
}
if(am > 15){
ctx.replyWithMarkdown('Sorry, *Max 15 Users* per sec broadcast can be set.')
return
}
data.broad_speed = 1000/am*1
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Broadcast Speed Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
addadmin.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid User ID*')
return
}
if(data.bot_admin.includes(am*1)){
ctx.replyWithMarkdown('This user is already admin')
return
}
data.bot_admin.push(am*1)
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*User Had Promoted :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
rmvadmin.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(isNaN(am)){
ctx.replyWithMarkdown('*Invalid User ID*')
return
}
if(!data.bot_admin.includes(am*1)){
ctx.replyWithMarkdown('This user is not admin')
return
}
data.bot_admin = data.bot_admin.filter((id)=>id!==am*1)
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*User Had Demoted :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
acheck.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(!am.startsWith('@')){
ctx.replyWithMarkdown('*Invalid Username*')
return
}
if(data.check.includes(am)){
ctx.replyWithMarkdown('This channel is already in check')
return
}
data.check.push(am)
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Channel Has Added In Check :)*\n*Note :-* _If Bot Isn\'t Admin In Channel, It Will Won\'t Work In Must Join And Not Effect Bot Even._\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
currency.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.bot_cur = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''}))
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your Bot Currency Name Has Updated :)*',{reply_markup:{inline_keyboard:rows}})
})
rpcurl.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.rpc = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''}))
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your RPC URL Has Updated :)*',{reply_markup:{inline_keyboard:rows}})
})
blockurl.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.block_url = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''}))
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your Block Chain URL Has Updated :)*',{reply_markup:{inline_keyboard:rows}})
})

key.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.key = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your Private Key Has Updated :)*',{reply_markup:{inline_keyboard:rows}})
})
addr.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.address2 = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Your Wallet Address Has Updated :)*',{reply_markup:{inline_keyboard:rows}}) 
ctx.scene.leave();
}) 
contract.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
data.contract = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your Token Contract Address Has Updated :)*',{reply_markup:{inline_keyboard:rows}}) 
}) 
payout.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
if(!ctx.message.text.startsWith("@")) {
ctx.replyWithMarkdown('*Invalid Username*')
return
}
data.payout = ctx.message.text
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
const buttons = withdraw_options.map((word) => ({ text: (word.includes('Auto') || word.includes('Manual')) ? (word.replace(/ /g,'-').toLowerCase()===data.with_type) ? word+'✅' : word+'❌' : word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+''})) 
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.scene.leave();
ctx.replyWithMarkdown('*Your Payout Channel Has Updated :)*',{reply_markup:{inline_keyboard:rows}}) 
}) 
rcheck.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
const am = ctx.message.text
if(!am.startsWith('@')){
ctx.replyWithMarkdown('*Invalid Username*')
return
}
if(!data.check.includes(am)){
ctx.replyWithMarkdown('This channel is not in check')
return
}
data.check = data.check.filter((id)=>id!==am)
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Channel Has Removed From Check :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
botoff.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
let htmlMessage = toHTML(ctx.message)
data.bot_text = htmlMessage
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Bot Turned Off Message Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})

welcomemsg.on('text',async ctx => {
if(ctx.message.text=='/cancel'){
ctx.replyWithMarkdown('*Done*')
ctx.scene.leave();
return
}
let htmlMessage = toHTML(ctx.message)
data.welcome = htmlMessage
await fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
ctx.scene.leave();
const buttons = options.map((word) => ({ text: word, callback_data: 'adhymn_'+word.replace(/ /g,'-').toLowerCase()+'' }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }
ctx.replyWithMarkdown('*Welcome Message Has Updated :)*\n\n_Here Is Your Admin Panel._',{reply_markup:{inline_keyboard:rows}})
})
function sendError(err,ctx){
console.log(err)
}
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
async function saveUserData2(userId, userData) {
  try {
    const filePath = './db/'+userId+'.json';
    userDataEntry = [{ user_id: userId, data: {} ,reset: false}];

    userDataEntry[0].data = userData;

    fs.writeFileSync(filePath, JSON.stringify(userDataEntry, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

async function getUserData(userId) {
  try {
    const existingData = JSON.parse(fs.readFileSync('./db/'+userId+'.json', 'utf8'));
    if (!Array.isArray(existingData)) {
      console.error('Data is not an array');
      return {};
    }
    const userDataEntry = existingData.filter((data) => data.user_id == userId)[0];
    if (!userDataEntry) {
      console.error('User data not found');
      return {};
    }
    return userDataEntry.data || {};
  } catch (error) {
    console.error('Error reading or parsing data:', error);
    return {};
  }
}

async function saveUserData(userId, userData) {
  try {
    const existingData = JSON.parse(fs.readFileSync('./db/'+userId+'.json', 'utf8'));
    if (!Array.isArray(existingData)) {
      console.error('Data is not an array');
      return {};
    }
    const userDataEntry = existingData.find((data) => data.user_id == userId);
    if (!userDataEntry) {
      console.error('User data not found');
      return {};
    }
    userDataEntry.data = userData;
    fs.writeFileSync('./db/'+userId+'.json', JSON.stringify(existingData,null,2), 'utf8');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

async function check(ctx, next) {
  const data = await getUserData(ctx.from.id);
  if (!data.address) {
    ctx.replyWithMarkdown('*Register Now With /start*')
return
    }
  await next();
}

async function getAllUserData() {
  try {
    const dataFolderPath = './db/';
    const fileNames = fs.readdirSync(dataFolderPath);

    const userData = fileNames.map((fileName) => {
      const filePath = path.join(dataFolderPath, fileName);
      try {
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return fileData;
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null; // or handle the error in a way that fits your needs
      }
    });

    return userData.filter((data) => data !== null).flat();
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return [];
  }
}

function getTopUsers(userData) {
  try {
      return userData
        .filter((user) => !user.reset && user.data.ref)
        .sort((a, b) => {
          try {
            return (b.data.ref.length || 0) - (a.data.ref.length || 0);
          } catch (error) {
            console.error('Error sorting users:', error);
            console.log('Problematic user data:', a, b);
            return 0;
          }
        })
        .slice(0, 20);
  } catch (error) {
    return [];
  }
}

function getUserPosition(userData, id) {
  try {
    userData.sort((a, b) => (b.data.ref.length || 0) - (a.data.ref.length || 0));

    const position = userData.findIndex(user => user.user_id === id) + 1;
    return position;
  } catch (error) {
    console.error('Error:', error);
    return 'N/A'
  }
}
function getUserIdsFromDataFolder() {
  const userIds = [];
  const files = fs.readdirSync('./db/');

  for (const file of files) {
    const userId = parseInt(path.parse(file).name, 10);
    if (!isNaN(userId)) {
      userIds.push(userId);
    }
  }

  return userIds;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
