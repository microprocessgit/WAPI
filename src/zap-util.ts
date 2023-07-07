import {
  find,
  update,
  insertMessageFila,
  getMessageActions,
  getClient,
  getMessagesUser,
  deleteMessages,
  getSentMessages,
  statusOfSend
} from './services/client';
import fs, { mkdir } from 'fs';
import { get, post } from './services/request';
import { globSync, glob } from 'glob';
import Downloader from 'nodejs-file-downloader';

const clientsList = new Map();

export function insertClients() {
  find().then(clients => {
    for (const val of clients) {
      setClientList(val);
    }
  });
}

export function updateClients(req: any) {
  update(req).then(clients => {
    if (clients) {
      setClientList(clients);
    }
  });
}


function setClientList(clients: any) {
  const { client, key, webhook } = clients;
  clientsList.set(client, { key, webhook });
}

export function clientListExists(req: any) {
  const { sessionId, sessionKey } = req.body;
  let result;
  clientsList.forEach((value, item) => {
    if (item == sessionId)
      result = value.key;
  })
  return (result == sessionKey);
}

export function getWebhook(client: any) {
  let result = '';
  clientsList.forEach((value, item) => {
    if (item == client) {
      result = value.webhook;
    }
  })

  return result;
}

export async function uploadMedia(req: any) {
  let fileName = req.headers.filename;
  mkdir(getUploadPath(), { recursive: true }, (err) => { if (err) throw err; });
  let stream = req.pipe(fs.createWriteStream(getUploadPath() + fileName));
  return await new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('arquivo gravado');
      resolve(getUploadPath() + fileName);
    }).on('error', (err: any) => {
      reject(err);
    });
  });
};

function getUploadPath() {
  return __dirname + "/uploads/";
}

//deleta medias da pasta upload
export async function deleteMedia(message: any) {
  for (const tipoMedia of Object.keys(message)) {
    if ((tipoMedia.toLowerCase() == 'image') || (tipoMedia.toLowerCase() == 'video') ||
      (tipoMedia.toLowerCase() == 'audio') || (tipoMedia.toLowerCase() == 'documento')) {
      try {
        await fs.unlink(message[tipoMedia].url, (err) => {
          if (err) throw err
          console.log('file was deleted');
        });
      } catch (e) {
        console.log(e);
      }
      break;
    }
  }
}

export async function addMessageToFila(req: any) {
  return await insertMessageFila(req);
}

export async function readMessages(req: any) {
  let val: any = {}, response: any, myId;
  let data = [];
  const res = await getSentMessages(req.body.fromDate);
  myId = '';
  for (val of res) {
    response = await readResponse(val);
    if (response?.responseMessage == undefined) {
      data.push(apendMessage(val, null));
      if (response != undefined) {
        myId = myId.concat(response, ',');
      }
    } else {
      data.push(apendMessage(val, response));
    }
  }
  if (myId != '') {
    statusOfSend(myId, 'NOTANSWERED');
  }
  return removeResponse(data, myId);
}

function removeResponse(data: any[], myId: any) {
  const myIds = myId.split(',');
  for (myId of myIds) {
    data.filter(res => res.myId == myId)
      .map(res => {
        res.response = null;
      });
  }
  for (let i = data.length; i > 0; i--) {
    if (data[i - 1].statusOfSend === "NOTANSWERED" && !data[i - 1].response) {
      data.splice(i - 1, 1);
    }
  }
  return data;
}

function apendMessage(val: any, response?: any) {
  return {
    message: val.message,
    timestamp: Number(val.messageTimestamp),
    id: val.id,
    myId: val.myId,
    remoteJid: val.remoteJid,
    response: response == undefined ? null : response,
    statusOfSend: val.statusOfSend
  };
}

async function readResponse(value: any) {
  let response, res: any = {};
  if (value.isAction) {
    res = await getMessageActions(value);
    for (const val of res) {
      if (val?.myId != null && value.remoteJid == val?.remoteJid && val.isAction) {
        response = value.myId + ',' + val.myId;
        break;
      } else if (!isNaN(val?.message.conversation)) {
        response = {
          responseMessage: val?.message.conversation,
          timestamp: Number(val?.messageTimestamp)
        };
        break;
      }
    }
  }
  return response;
}

export async function getMessages(req: any) {
  let urlImageFromMe, urlImage;
  const messages = await getMessagesUser(req);
  for (const val of messages!) {
    if ((getDecryptMedia(val)) && (!existFile(val.remoteJid + val))) {
      downloadMedia(val);
    }
    if ((val.myId == null) && (!urlImage)) {
      urlImage = await downloadProfile(val, false);
    } else if (!urlImageFromMe) {
      urlImageFromMe = await downloadProfile(val, true);
    }
  }
  return { messages, urlImage, urlImageFromMe };
}

export async function downloadMedia(value: any) {
  const res = await post(
    `${'http://' + process.env.HOST + ':' + process.env.PORT}/${value.sessionId}/messages/download`,
    { message: value.message }, { "Content-type": "application/json; charset=UTF-8" }, 'arraybuffer');
  fs.writeFile(getDownloadPath() + getFileName(value), res!.data, err => {
    if (err)
      console.log(err)
  })
}

async function downloadProfile(value: any, fromMe: any) {
  let remoteJid
  if (!fromMe) {
    remoteJid = value.remoteJid;
  } else {
    let res = await getClient(value.sessionId);
    let telefone = res?.telefone?.replace(/[-+" '()]/g, "");
    remoteJid = telefone! + process.env.WHATSAPPSERVER;
  }
  if (!existFile(remoteJid + '.jpg')) {
    const res = await get(
      `${'http://' + process.env.HOST + ':' + process.env.PORT}/${value.sessionId}/contacts/${remoteJid}/photo`,
      { "Content-type": "application/json; charset=UTF-8" }, 'json');
    if (res?.data) {
      const downloader = new Downloader({
        url: res!.data.url,
        directory: getDownloadPath(),
        fileName: remoteJid + '.jpg'
      });
      try {
        await downloader.download();
      } catch (error) {
        console.log(error);
      }
      return remoteJid + '.jpg';
    } else {
      return undefined;
    }
  } else {
    return remoteJid + '.jpg';
  }
}

function getDecryptMedia(msg: any) {
  return msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage.imageMessage ||
    msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage.videoMessage ||
    msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage.audioMessage ||
    msg.message.documentMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage.documentMessage;
}

function getDownloadPath() {
  let path = require('path').dirname(__dirname);
  path = path + '/views/chat/downloads/';
  mkdir(path, { recursive: true }, (err) => { if (err) throw err; });
  return path;
}

export function getFileName(value: any) {
  const decryptMedia = getDecryptMedia(value);
  if (!decryptMedia) return '';

  const mime = decryptMedia.mimetype;
  let extension = mime.substring(mime.lastIndexOf("/") + 1).split(";")[0];
  return value.remoteJid + value.id + '.' + extension;
}

export async function excluirMensagens(values: any) {
  //const res = await deleteMessages(values);
  if (true) {
    const files = await glob([getDownloadPath() + values.remoteJid + '*']);
    for (const val of files) {
      fs.unlink(val, function (err) {
        if (err) return console.log(err);
        console.log('file deleted successfully');
      });
    }
  }
  return true;
}

function existFile(fileName: any) {
  const files = globSync(getDownloadPath() + '/**/' + fileName);
  return files.length > 0;
}

export async function setStatusOfSend(req: any) {
  const list = req.body;
  for (const item of Object.keys(list)) {
    await statusOfSend(item, list[item])
  }
}

