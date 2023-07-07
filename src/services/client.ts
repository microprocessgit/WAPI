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

export async function getClient(client: any) {
  return await prisma.client.findFirst({
    where: {
      client: client
    }
  });
}

export async function update(req: any) {
  var { client, key, webhook, telefone, sessionId, sessionKey } = req.body;
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
        webhook: webhook,
        telefone: telefone
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
  const { jid, message, options, myId, isAction } = req.body;
  const client = req.params.sessionId;
  try {
    await prisma.messageFila.create({
      data: {
        jid: jid,
        message: message,
        options: options,
        client: client,
        myId: myId,
        isAction: isAction
      }
    });
    return true;
  } catch (e) {
    logger.error(e, 'An error occured during message create' + jid);
    return false;
  }
}

export async function getMessageActions(value: any) {
  const { messageTimestamp, remoteJid } = value;
  try {
    const res = await prisma.message.findMany(
      {
        where: {
          messageTimestamp: { gt: parseInt(messageTimestamp) },
          remoteJid: remoteJid,
        },
        orderBy: {
          pkId: 'asc'
        }
      }
    );
    return res;
  } catch (e) {
    logger.error(e, 'An error occurred while querying response');
  }
}

export async function getSentMessages(dateTime: any) {
  try {
    const messageTimestamp = Math.round(new Date(dateTime).getTime() / 1000);
    const res = await prisma.message.findMany(
      {
        where: {
          messageTimestamp: { gte: messageTimestamp },
          OR: [
            {
              statusOfSend: "NOTSENT"
            },
            {
              statusOfSend: "NOTANSWERED"
            }
          ],
          myId: {
            not: null
          }
        },
        orderBy: {
          pkId: 'asc'
        }
      }
    );
    return res;
  } catch (e) {
    logger.error(e, 'An error occurred while querying sent messages');
    return [];
  }
}

export async function getMessagesUser(req: any) {
  const { remoteJid, timestamp } = req.query;
  try {
    return await prisma.message.findMany(
      {
        where: {
          messageTimestamp: { gte: parseInt(timestamp) },
          remoteJid: {
            contains: remoteJid
          }
        },
        orderBy: {
          pkId: 'asc'
        }
      }
    );
  } catch (e) {
    logger.error(e, 'An error occurred while querying response');
  }
}

export async function deleteMessages(values: any) {
  const { remoteJid, timestamp } = values;
  try {
    const result = await prisma.message.deleteMany(
      {
        where: {
          messageTimestamp: { gte: parseInt(timestamp) },
          remoteJid: remoteJid
        }
      }
    );
    return result;
  } catch (e) {
    logger.error(e, 'An error occurred while querying response');
    return false;
  }
}

export async function statusOfSend(myId: any, status: any) {
  try {
      await prisma.message.updateMany({
        where: {
          myId: {
            contains: myId
          }
        },
        data: { statusOfSend: status },
      });
  } catch (e) {
    logger.error(e, 'An error occurred while updating status');
  }
}