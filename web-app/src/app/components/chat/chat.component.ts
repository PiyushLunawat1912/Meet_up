import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
    imports: [
    FormsModule,NgFor,NgClass,CommonModule,PickerModule ],
     providers: [DatePipe]
})
export class ChatComponent implements OnInit {
  conversationId = '';
  currentUserName = '';
  messages: any[] = [];
  newMessage = '';
  currentUserId = '';
  socket!: Socket;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

ngOnInit() {
  const currentUserString = localStorage.getItem('user');
  const currentUser = JSON.parse(currentUserString!);
  this.currentUserId = currentUser._id;
  this.currentUserName = currentUser.name; // <- ADD THIS LINE

  this.conversationId = this.route.snapshot.params['id'];
  this.socket = io(environment.apiUrl);

  this.socket.emit('join-conversation', this.conversationId);

  this.socket.on('receive-message', (msg: any) => {
    this.messages.push(msg); // Received message from others (already has name)
  });

  this.http.get(`${environment.apiUrl}/api/conversation/${this.conversationId}`)
    .subscribe((data: any) => {
      this.messages = data.message;
    });
}

 sendMessage() {
  const msg = {
    conversationId: this.conversationId,
    sender: this.currentUserId,
    text: this.newMessage,
    timestamp: new Date()
  };

  this.socket.emit('send-message', msg);

  // Optimistic message push with name so the sender also sees it properly
  this.messages.push({
    sender: {
      _id: this.currentUserId,
      name: this.currentUserName
    },
    text: this.newMessage,
    timestamp: new Date()
  });

  this.newMessage = '';
}
ngAfterViewChecked() {
  this.scrollToBottom();
}

scrollToBottom() {
  const container = document.querySelector('.messages');
  if (container) container.scrollTop = container.scrollHeight;
}
showEmojiPicker = false;

addEmoji(event: any) {
  this.newMessage += event.emoji.native;
}

}
