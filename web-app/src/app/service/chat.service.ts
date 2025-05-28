import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
 socket = io(environment.apiUrl);
  constructor() { }

  joinConversation(conversationId:string){
    this.socket.emit('join-conversation', conversationId);
  };

  sendMessage(data:any){
    this.socket.emit('send-message', data);
  };

  onMessage(callback:(data:any)=> void){
    this.socket.on('new-message', callback);
  }
}
