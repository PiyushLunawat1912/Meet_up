// group-chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environment/environment';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css'],
  imports: [FormsModule,CommonModule,PickerModule],
  providers: [DatePipe]
})
export class GroupChatComponent implements OnInit {
  socket!: Socket;
  groupId = '';
  messages: any[] = [];
  newMessage = '';
  currentUserId = '';
  currentUserName = '';
    showEmojiPicker: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('user')!);
    this.currentUserId = userData._id;
    this.currentUserName = userData.name;
    this.groupId = this.route.snapshot.params['id'];

    this.socket = io(environment.apiUrl);
    this.socket.emit('join-group', this.groupId);

    this.socket.on('receive-group-message', (msg: any) => {
      this.messages.push(msg);
    });

    this.http.get(`${environment.apiUrl}/api/group/${this.groupId}`).subscribe((group: any) => {
      this.messages = group.messages;
    });
  }

  addEmoji(event: any) {
    const emoji = event.emoji?.native || event.native;
    this.newMessage += emoji;
  }
  sendMessage() {
    const msg = {
      groupId: this.groupId,
      sender: this.currentUserId,
      text: this.newMessage,
      timestamp: new Date()
    };

    this.socket.emit('send-group-message', msg);

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
}
