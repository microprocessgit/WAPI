import { getWebhook } from '../zap-util';
import { post } from './request';

export function webhook(instance:any, type:any, json:any) {
  const host = getWebhook(instance);
  let { myId, statusCode, data } = json;
  var content;
  if(type.split("/")[1] == 'qrcode'){
    data = json;
  }
  content = {instance, type,  myId, statusCode, data}
  //comment if condition to send messages
  if ((type.split("/")[0] != 'connection') && (type != 'fila-message-sent')){
    content = {};
  }

  const res = post(`${host}/wahook/${type}`, content, { "Content-type": "application/json; charset=UTF-8" }, 'json');
  console.log(res);

}

