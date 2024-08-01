import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  LEAVE_BASE_URL_API = "http://localhost:3000/api/";

  constructor(private httpClient: HttpClient) { }

  getAllLeaves() : Observable<{message: string, leaves: { count: number, rows: Leave[]}}>{
    return this.httpClient.get<{message: string, leaves: { count: number, rows: Leave[]}}>(this.LEAVE_BASE_URL_API + 'leaves');
  }

  getLeavesByUserId(leaveId: number) : Observable<{message: string, leaves: Leave[]}>{
    return this.httpClient.get<{message: string, leaves: Leave[]}>(this.LEAVE_BASE_URL_API + 'leaveByUserId/' + leaveId);
  }

  createLeaveForUser(leave: Leave) : Observable<{message: string, leave: Leave}>{
    return this.httpClient.post<{message: string, leave: Leave}>(this.LEAVE_BASE_URL_API + 'leave', leave);
  }

  updateLeave(leave:Leave, leaveId: number) : Observable<{message: string, leave: Leave}>{
    return this.httpClient.put<{message: string, leave: Leave}>(this.LEAVE_BASE_URL_API + 'leave/' + leaveId, leave);
  }

  deleteLeave(leaveId: number) : Observable<{ message: string }>{
    return this.httpClient.delete<{ message: string }>(this.LEAVE_BASE_URL_API + 'leave/' + leaveId);
  }
}
