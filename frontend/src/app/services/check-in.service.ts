import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CheckIn } from '../models/check-in.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

  CHECK_IN_BASE_URL_API = "http://localhost:3000/api/";


  constructor(private httpClient: HttpClient, private router: Router) { }

  getAllCheckIns() : Observable<{message: string, checkIns: { count: number,  rows: CheckIn[]}}>{
    return this.httpClient.get<{message: string, checkIns: { count: number,  rows: CheckIn[]}}>(this.CHECK_IN_BASE_URL_API + 'checkIns');
  }

  createCheckIn(checkIn: CheckIn) : Observable<{message: string, checkIn: CheckIn}>{
    return this.httpClient.post<{message: string, checkIn: CheckIn}>(this.CHECK_IN_BASE_URL_API + 'checkIn', checkIn);
  }

  getCheckInByUserId(userId: number) : Observable<{message: string, checkIns: CheckIn[]}>{
    return this.httpClient.get<{message: string, checkIns: CheckIn[]}>(this.CHECK_IN_BASE_URL_API + 'checkInByUserId/' + userId);
  }

  updateCheckIn(checkIn: CheckIn) : Observable<{message: string, checkIn: CheckIn}>{
    return this.httpClient.put<{message: string, checkIn: CheckIn}>(this.CHECK_IN_BASE_URL_API + 'checkIn/' + checkIn.id, checkIn);
  }

  deleteCheckIn(checkInId: number) : Observable<{message: string}>{
    return this.httpClient.delete<{message: string}>(this.CHECK_IN_BASE_URL_API + 'checkIn/' + checkInId);
  }
}
