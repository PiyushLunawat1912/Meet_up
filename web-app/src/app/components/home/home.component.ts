import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import this
import { NgFor } from '@angular/common'; 
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-home',
    imports: [CommonModule,RouterOutlet, RouterLink, ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 
   router = inject(Router);
    navigateToStartConversation(){
      this.router.navigate(['/start']);
    }



}
