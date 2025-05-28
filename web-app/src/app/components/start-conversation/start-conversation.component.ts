import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // ✅ Import this


@Component({
  selector: 'app-start-conversation',
  imports: [
    FormsModule ],
  templateUrl: './start-conversation.component.html',
  styleUrl: './start-conversation.component.css'
})
export class StartConversationComponent {

  recipient : string = '';
http = inject(HttpClient)

router = inject(Router);

onSubmit(){
const currentUserString = localStorage.getItem('user');
const currentUser = JSON.parse(currentUserString!);

const currentUserId = currentUser._id;



  this.http.post(environment.apiUrl + '/api/conversation/start', {
    senderId: currentUserId,
    recipientUsername: this.recipient
  }).subscribe({
    next: (response: any) => {
      console.log('Conversation Started', response);
        const recipientUser = response.participants.find((p: any) => p._id !== currentUserId);
  console.log('Recipient username:', recipientUser?.username);
      this.router.navigate(['/chat', response._id]);
    },
    error: (error: any) => {
      console.error('Error starting conversation', error);
    }
  });
}

}
