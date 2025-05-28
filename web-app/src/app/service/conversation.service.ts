import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor() { }

   http = inject(HttpClient);

   startConversation(senderId:string, receiverId:string) {
        return this.http.post(environment.apiUrl + '/api/conversation/start', {
  senderId,
  receiverId
});
   }
}
