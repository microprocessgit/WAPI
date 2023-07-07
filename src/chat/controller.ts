import { getMessages, downloadMedia, getFileName, excluirMensagens } from '../zap-util';

export async function chat(req: any, res: any) {
  let messages = [] as any;
  messages = await getMessages(req);
  if ((messages != undefined) && (messages.messages.length > 0)) {
    res.render('chat/chat.ejs', { messages, getFileName });
  } else {
    res.redirect('/app/chat/chat-vazio/');
  }
};

export async function deleteMessages(req: any, res: any) {
  const response = await excluirMensagens(req.body);
  if (response) {
    res.redirect('/app/chat/chat-vazio/');
  }
};

export async function chatVazio(req: any, res: any) {
  res.render('chat/chatEmpty.ejs');
};