// import { parentPort, workerData } from 'node:worker_threads';
// import { webhook } from './webhook';
// import { deleteMessageToSend, getMessages, exitsMessages } from './client';
// import fs from 'fs';
// import { getSession } from '../wa';

// // parentPort?.postMessage(
// //   prepare(workerData.client)
// // );

// // async function prepare(client: any) {
// //     getMessages().then(messages => {
// //       count = messages.length;
// //     });
// //     send(client);
// //     //await sleep(3000);
// //   }
// // }

// // function sleep(ms: any) {
// //   return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
// // }

// export async function prepare(client: any) {
//   let count = 1, result;
//   while (count > 0) {
//     exitsMessages().then(messages => {
//       count = messages.length;
//     });
//     result = send(client) ;
//     await new Promise(resolve => setTimeout(resolve, 5000));
  
//   }

//   console.log(result);
//   return result;

// }


// function send(client: any) {
//   const session = getSession(client)!;
//   getMessages().then(teste => {
//     for (const val of messages) {
//       const { pkId, jid, message, options } = val;
//       // const result = session.sendMessage(jid, JSON.parse(JSON.stringify(message)));
//       // webhook('', 'messages/sent', result)
//       // deleteMedia(message);
//       deleteMessageToSend(pkId);
//     }
//   });
//   return 'ok'
// }

// //deleta medias da pasta upload
// export async function deleteMedia(message: any) {
//   for (const tipoMedia of Object.keys(message)) {
//     if ((tipoMedia.toLowerCase() == 'image') || (tipoMedia.toLowerCase() == 'video') ||
//       (tipoMedia.toLowerCase() == 'audio') || (tipoMedia.toLowerCase() == 'documento')) {
//       try {
//         await fs.unlink(message[tipoMedia].url, (err) => {
//           if (err) throw err
//           console.log('file was deleted');
//         });
//       } catch (e) {
//         console.log(e);
//       }
//       break;
//     }
//   }
// }
