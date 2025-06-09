import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  constructor() { }
   http = inject(HttpClient);

   joinChannel(name:string,participantsIds:string[]){
    return this.http.post(`${environment.apiUrl}/group/create`,{
      name,
      participantsIds
    });

   }

   getUserGroups(userId:string){
    return this.http.get(`${environment.apiUrl}/group/user/${userId}`);
   }

   getGroupMessages(groupId:string){
        return this.http.get(`${environment.apiUrl}/group/messages/${groupId}`);
   }

   getAllGroups() {
  return this.http.get<any[]>(`${environment.apiUrl}/group/all`);
}

joinGroup(groupId: string, userId: string) {
  return this.http.patch(`${environment.apiUrl}/group/join/${groupId}`, { userId });
}
}
