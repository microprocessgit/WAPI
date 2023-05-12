import { prisma, logger } from '../shared';

export async function insert(client: any) {
  try {
    return await prisma.client.create({ data: client });
  } catch (e) {
    logger.error(e, 'An error occured during client create');
  }

}

export async function find() {
  return await prisma.client.findMany();
}

export async function update(req: any) {
  var { client, key, webhook, sessionId, sessionKey } = req.body;
  if (client == undefined) client = sessionId;
  if (key == undefined) key = sessionKey;
  try {
    return await prisma.client.update({
      where: {
        client: client
      },
      data: {
        client: client,
        key: key,
        webhook: webhook
      }
    });
  } catch (e) {
    logger.error('An error occured during client update');
  }
}

export async function deleteClient(id: any) {
  return await prisma.client.delete({
    where: {
      pkId: parseInt(id),
    },
  })
}

export async function insertMessageFila(req: any){
  const { jid, message, options } = req.body;
const client = req.params.sessionId;
  try {
      await prisma.messageToFila.create({ data:{
      jid:jid,
      message: message,
      options: options,
      client: client
    }});
    return true;
  } catch (e) {
    logger.error(e, 'An error occured during message create'+jid);
    return false;
  }
}
