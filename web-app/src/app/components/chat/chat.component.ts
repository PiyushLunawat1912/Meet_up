import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
    imports: [
    FormsModule,NgFor ],
})
export class ChatComponent implements OnInit {
  conversationId = '';
  messages: any[] = [];
  newMessage = '';
  currentUserId = '';
  socket!: Socket;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const currentUserString = localStorage.getItem('user');
    const currentUser = JSON.parse(currentUserString!);
    this.currentUserId = currentUser._id;

    this.conversationId = this.route.snapshot.params['id'];

    this.socket = io(environment.apiUrl);

    // Join the conversation room
    this.socket.emit('join-conversation', this.conversationId);

    // Listen for messages
    this.socket.on('receive-message', (msg: any) => {
      this.messages.push(msg);
    });

    // Load old messages
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
    this.messages.push(msg); // Optional: optimistic UI
    this.newMessage = '';
  }
}
