import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  imports: [FormsModule,MatIconModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
   router = inject(Router);
   http = inject(HttpClient);

    authService = inject(AuthService);
logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login').then(() => {
    window.location.reload(); // force re-evaluation of localStorage-dependent data
  });
  }
}
