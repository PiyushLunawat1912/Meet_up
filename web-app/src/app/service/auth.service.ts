import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  http = inject(HttpClient);
  submit(name:string,email:string,password:string)
  {
     return this.http.post(environment.apiUrl + '/auth/sign-up',{
      name,
      email,
      password,
     })
  }

  login(email:string,password:string){
    return this.http.post(environment.apiUrl + '/auth/login',{
      email,
      password,
  })
}

get isLoggedIn() {
  return !!localStorage.getItem('token');
}

get userName() {
  let userData = localStorage.getItem("user");
  if (userData) {
    return JSON.parse(userData).name;
  }
  return null;
}

logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

}
