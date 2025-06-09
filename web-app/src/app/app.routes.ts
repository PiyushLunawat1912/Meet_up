import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { StartConversationComponent } from './components/start-conversation/start-conversation.component';
import { ChatComponent } from './components/chat/chat.component';
import { authGuard } from './auth-gaurd';
import { GroupChatComponent } from './components/group-chat/group-chat.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'login', component: LoginComponent },
    { path: 'start', component: StartConversationComponent,
        canActivate: [authGuard]  // Protect this route with authGuard
     },
     { path: 'chat/:id', component: ChatComponent },
     { path: 'group-chat/:id', component: GroupChatComponent }

   
];
