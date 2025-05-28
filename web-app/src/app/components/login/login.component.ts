import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

   formbuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.formbuilder.group({
   
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
 
  }, );
loginError = '';
  login(){
      if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }


    const {email, password} = this.loginForm.value;
     this.authService.login(email!, password!).subscribe({
  next: (result: any) => {
    console.log(result);
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    this.router.navigate(['/home']);
  },
  error: (err) => {
    console.error(err);
    this.loginError = err?.error?.error || "Login failed. Please try again.";
  }
});
     

  }
}


