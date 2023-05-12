// import { Worker, isMainThread } from 'node:worker_threads';
// import { insertMessageToSend, deleteMessageToSend, exitsMessages } from './client';
// import { prepare } from './worker';



// // export async function messageByThread(data: any) {
// //   const { jid, message, options, client } = data;

// //   insertMessage(jid, message, options);

// // if (isMainThread) {
// //   console.log('main thread start...');
// //   const worker = new Worker('./src/services/worker.ts', { workerData: { client: client}});
// //   worker.on('message', (msg) => {
// //     console.log(`Worker: ${msg}`);
// //   });
// //   worker.on("error", error => {
// //     console.log(error);
// //   });

// //   worker.on("exit", exitCode => {
// //     console.log(exitCode);
// //   })


// //     console.log("doing some random work in main thread..!!");
// //   }
// // }

// // function runService(client: any) {
// //   return new Promise((resolve, reject) => {
// //     const worker = new Worker('./src/services/worker.ts', { workerData: { client: client } });
// //     worker.on('message', resolve);
// //     worker.on('error', reject);
// //     worker.on('exit', (code) => {
// //       if (code !== 0)
// //         reject(new Error(`Worker stopped with exit code ${code}`));
// //     })
// //   })
// // }

// // export async function messageByThread(data: any) {
// //   const { jid, message, options, client } = data;
// //   insertMessage(jid, message, options);
// //   let count = 1, result;
// //   while (count > 0) {
// //     exitsMessages().then(messages => {
// //       count = messages.length;
// //     });
// //     result = await runService(client);
// //     await new Promise(resolve => setTimeout(resolve, 5000));
// //     console.log('=====================================================================================')
// //   }

// //   console.log(result);
// //   return result;

// // }

// // export async function messageByThread(data: any) {
// //     const { jid, message, options, client } = data;
// //     insertMessage(jid, message, options);
// //     const result = await runService(client);
// //     console.log(result);
// //     return result;

// //   }

//   export async function messageByThread(data: any) {
//     const { jid, message, options, client } = data;
//     (async () => {
//       await Promise.allSettled([
//         insertMessage(jid, message, options), 
//         prepare(client)]);
//     })();
//     // console.log(result);
//     // return result;

//   }






// export function insertMessage(jid: any, message: any, options: any) {
//   insertMessageToSend({ jid: jid, message: message, options: options }).then(messages => {
//     return messages;
//   });
// }

// export function deleteMessage(id: any) {
//   deleteMessageToSend({ id }).then(messages => {
//     return messages;
//   });
// }