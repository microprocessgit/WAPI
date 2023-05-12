import { getWebhook } from '../zap-util';
import { post } from './request';

export function webhook(instance:any, type:any, data:any) {
  const host = getWebhook(instance);
  var content;
  content = {instance, type, data}
  //comment if condition to send messages
  let messageType = type.split("/")[0]; 
  if ((messageType != 'connection') && (messageType != 'sent')){
    content = {};
  }

  const res = post(`${host}/`, content);
  console.log(res);

}

