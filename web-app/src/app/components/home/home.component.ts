import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { GroupChatService } from '../../service/group-chat.service';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  conversation: any[] = [];
  currentUserId: string = '';
  groupName: string = '';
  selectedUserIds: string[] = [];
  allUsers: any[] = [];
  userGroups: any[] = [];

  socket!: Socket;

  private http = inject(HttpClient);
  private router = inject(Router);
  private groupService = inject(GroupChatService);

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserId = user?._id;

      // Load direct messages
      this.http.get(`${environment.apiUrl}/api/conversation/user/${this.currentUserId}`)
        .subscribe((data: any) => {
          this.conversation = data.map((convo: any) => {
            const otherUser = convo.participants.find((p: any) => p._id !== this.currentUserId);
            return {
              _id: convo._id,
              user: otherUser
            };
          });
        });

      // Load user groups
      this.loadUserGroups();

      // Load all users except current user
      this.http.get<any[]>(`${environment.apiUrl}/auth/all-users`)
        .subscribe({
          next: (users) => {
            this.allUsers = users;
          },
          error: (err) => {
            console.error('Error fetching users:', err);
          }
        });

      // Connect to socket
      this.socket = io(environment.apiUrl);

      // Listen for real-time group creation
      this.socket.on('group-created', (group: any) => {
        if (group.participants.includes(this.currentUserId)) {
          this.userGroups.push(group);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToStartConversation() {
    this.router.navigate(['/start']);
  }

  openChat(convoId: string) {
    this.router.navigate(['/chat', convoId]);
  }

  openGroupChat(groupId: string) {
    this.router.navigate(['/group-chat', groupId]);
  }

  joinGroupAndOpen(groupId: string) {
    this.groupService.joinGroup(groupId, this.currentUserId).subscribe(() => {
      this.openGroupChat(groupId);
    });
  }

  toggleUserSelection(userId: string, event: any) {
    if (event.target.checked) {
      this.selectedUserIds.push(userId);
    } else {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    }
  }

  createGroup() {
    if (!this.groupName.trim() || this.selectedUserIds.length === 0) {
      alert('Please enter a group name and select users.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?._id;
    const participants = [...this.selectedUserIds, userId];

    this.groupService.joinChannel(this.groupName, participants).subscribe({
      next: (res) => {
        console.log('Group created:', res);
        this.socket.emit('group-created', res); // ✅ Real-time emit
        this.groupName = '';
        this.selectedUserIds = [];
        alert('Group created successfully!');
        this.loadUserGroups();
      },
      error: (err) => {
        console.error('Error creating group:', err);
        alert('Failed to create group');
      }
    });
  }

  loadUserGroups() {
    if (!this.currentUserId) return;
    this.groupService.getUserGroups(this.currentUserId).subscribe({
      next: (groups: any) => {
        this.userGroups = groups;
      },
      error: (err) => {
        console.error('Error fetching user groups:', err);
      }
    });
  }
}
