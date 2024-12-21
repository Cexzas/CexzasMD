require('./setting') 
const { WA_DEFAULT_EPHEMERAL, getAggregateVotesInPollMessage, generateWAMessageContent, generateWAMessage, downloadContentFromMessage, areJidsSameUser, getContentType, generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys") 
const util = require('util') 
const fs = require('fs') 
const chalk = require('chalk') 
const { youtube } = require("btch-downloader") 
const axios = require('axios') 
const yts = require('yt-search') 
const path = require('path')

const { fetchJson, sleep } = require('./database/function') 
const { bk9Ai, multiDownload } = require('./database/scraper') 
const { pickRandom, ytMp3 } = require('./database/function2') 
const { toAudio } = require('./database/convert')

module.exports = cexzas = async (cexzas, m, chatUpdate, store) => {
  try {
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'interactiveResponseMessage') ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : (m.mtype == 'templateButtonReplyMessage') ? m.msg.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '' 
    var budy = (typeof m.text == 'string' ? m.text : '') 
    const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '.' 
    const pushname = m.pushName || "No Name" 
    const isCmd = body.startsWith(prefix) 
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '' 
    const args = body.trim().split(/ +/).slice(1) 
    const botNumber = await cexzas.decodeJid(cexzas.user.id) 
    const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) 
    const text = q = args.join(" ") 
    const { type, quotedMsg, mentioned, now, fromMe } = m 
    const quoted = m.quoted ? m.quoted : m 
    const mime = (quoted.msg || quoted).mimetype || '' 
    const isMedia = /image|video|sticker|audio/.test(mime) 
    const from = mek.key.remoteJid 
    
    const downloadMp3 = async (url) => {
      try {
        let look = await yts(text) 
        let convert = look.videos[0] 
        const pl = await youtube(convert.url) 
        await cexzas.sendMessage(m.chat, { audio: { url: pl.mp3 }, fileName: convert.title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m })
      } catch (err) {
        m.reply(`*Eror, url tidak valid, pastikan url dari fitur ${prefix}ytsearch*`)
      }
    } 
    
    const downloadMp3 = async (url) => {
      let look = await yts(text) 
      let convert = look.videos[0] 
      const pl = await youtube(convert.url) 
      await cexzas.sendMessage(m.chat, { audio: { url: pl.mp3 }, fileName: convert.title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m })
    }
    
    async function edit2 (tex1, tex2) {
      var nln =[ `${tex1}`, `${tex2}` ] 
      let { key } = await cexzas.sendMessage(from, {text: 'Loading...'},  { quoted: m }) 
      let duh = randomNomor(800, 1000) 
      for (let i = 0; i < nln.length; i++) {
        await sleep(duh) 
        await cexzas.sendMessage(from, {text: nln[i], edit: key }, { quoted: m })
      }
    }
    
    function randomNomor(min, max = null) {
      if (max !== null) {
        min = Math.ceil(min) 
        max = Math.floor(max) 
        return Math.floor(Math.random() * (max - min + 1)) + min
      } else {
        return Math.floor(Math.random() * min) + 1
      }
    }
    
    switch(command) { 
      case 'ai': {
        if (!text) return m.reply(`*Example: ${prefix+command} hai*`) 
        try {
          let hasil = await bk9Ai(text) 
          m.reply(hasil.BK9)
        } catch (err) {
          try {
            let hasil2 = await fetchJson(`https://api.agatz.xyz/api/megpt?message=${text}`) 
            m.reply(hasil2.data)
          } catch (err) {
            m.reply(`*Fitur sedang offline/eror*`)
          }
        }
      } 
      break 
      case 'ytsearch': {
        if (!text) return m.reply(`*Example: ${prefix+command} dj hilang harapan*`) 
        try {
          const res = await yts.search(text) 
          const hasil = pickRandom(res.all) 
          const teksnya = `*Judul:* ${hasil.title || 'Tidak tersedia'}\n*Deskripsi:* ${hasil.description || 'Tidak tersedia'}\n*Channel:* ${hasil.author?.name || 'Tidak tersedia'}\n*Source:* ${hasil.url || 'Tidak tersedia'}\n\n*Jika ingin mendownload silahkan*\n_pilih ${prefix}ytmp3 url atau ${prefix}ytmp4 url_` 
          await cexzas.sendMessage(m.chat, { image: { url: hasil.thumbnail }, caption: teksnya }, { quoted: m })
        } catch (err) {
          m.reply(`*Fitur sedang eror/offline*`)
        }
      } 
      break 
      case 'ytmp3': {
        if (!text) return m.reply(`*Example: ${prefix+command} url*`) 
        try {
          downloadMp3(text)
        } catch (err) {
          m.reply(`*Fitur sedang eror/offline*`)
        }
      } 
      break 
      case 'clearallsesi': {
        let directoryPath = path.join(`./session`) 
        fs.readdir(directoryPath, async function (err, files) {
          if (err) {
            return m.reply('Tidak dapat memindai direktori: ' + err)
          } 
          let filteredArray = await files.filter(item => item.startsWith("session") || item.startsWith("pre-key") || item.startsWith("sender-key")  ) 
          var teks = `Menghapus ${filteredArray.length} file sampah...\n\n` 
          if (filteredArray.length == 0) return m.reply(teks) 
          edit2(teks, 'Berhasil menghapus semua sampah') 
          await filteredArray.forEach(function (file) {
            fs.unlinkSync(`./session/${file}`)
          })
        })
      } 
      break
    } 
  } catch (err) {
    console.log(util.format(err))
  }
} 

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
  fs.unwatchFile(file) 
  console.log(`Update berhasil`) 
  delete require.cache[file] 
})