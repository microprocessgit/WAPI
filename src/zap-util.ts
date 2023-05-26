import { find, update, insertMessageFila, getSentMessages } from './services/client';
import fs, { mkdir } from 'fs';

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

//inverter as barras para linux
function getUploadPath() {
  return __dirname + "\\uploads\\";
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
  const myIdsList = req.body.myIds.split(',');
  let data = [];
  for (const val of myIdsList) {
    const res = await getSentMessages(val);
      if(res){
        data.push({ message: res.message, 
          timestamp: Number(res.messageTimestamp), id:res.id, myId:res.myId});
      }
  }
  return data;
}