import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Role } from '../models/enums/Role.enum';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  USER_BASE_URL = "http://localhost:3000/";

  USER_BASE_URL_API = "http://localhost:3000/api/";

  constructor(private httpClient: HttpClient, private router: Router) { }

  connect(email: string, password: string) : Observable<{token: string}>{
    return this.httpClient.post<{token: string}>(this.USER_BASE_URL + 'login', {'email': email, 'password': password});
  }

  connectWithGoogle(email: string) : Observable<{token: string}>{
    return this.httpClient.post<{token: string}>(this.USER_BASE_URL + 'loginViaGmail', {'email': email});
  }

  getUser(userId: number): Observable<{message: string, user: User}>{
    return this.httpClient.get<{message: string, user: User}>(this.USER_BASE_URL_API + 'user/' + userId);
  }

  getAllUsers(): Observable<{message: string, users: User[]}>{
    return this.httpClient.get<{message: string, users: User[]}>(this.USER_BASE_URL_API + 'users');
  }

  addUser(user: User): Observable<{message: string, user: User}>{ 
    return this.httpClient.post<{message: string, user: User}>(this.USER_BASE_URL_API + 'user', user);
  }

  sendForgotPassword(email: string) : Observable<{message: string}>{
    return this.httpClient.post<{message: string}>(this.USER_BASE_URL + 'resetPassword', {'email': email});
  }

  resetPassword(token: string, password: string): Observable<{message: string}>{
    return this.httpClient.post<{message: string}>(this.USER_BASE_URL + 'updatePassword', {'token': token, 'password': password});
  }

  updateUser(user: User): Observable<{message: string, user: User}>{
    return this.httpClient.put<{message: string, user: User}>(this.USER_BASE_URL_API + 'user/' + user.id, user);
  }

  deleteUser(userId: number): Observable<{message: string}>{
    return this.httpClient.delete<{message: string}>(this.USER_BASE_URL_API + 'user/' + userId);
  }
}
