import { toString } from 'qrcode';
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

export async function insertMessageFila(req: any) {
  const { jid, message, options, myId } = req.body;
  const client = req.params.sessionId;
  try {
    await prisma.messageFila.create({
      data: {
        jid: jid,
        message: message,
        options: options,
        client: client,
        myId: myId
      }
    });
    return true;
  } catch (e) {
    logger.error(e, 'An error occured during message create' + jid);
    return false;
  }
}

export async function getSentMessages(myId: any) {
  try {
    const res = await prisma.message.findMany(
      {
        where: {
          myId: myId
        }
      }
    );
    return res[0];
  } catch (e) {
    logger.error(e, 'An error occurred while querying myId');
    return false;
  }
}
