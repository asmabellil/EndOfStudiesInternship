import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  LOAN_BASE_URL_API = "http://localhost:3000/api/";

  LOAN_BASE_URL = "http://localhost:3000/";

  constructor(private httpClient: HttpClient) { }

  getAllLoans() : Observable<{message: string, prets: { count: number, rows: Loan[]}}>{
    return this.httpClient.get<{message: string, prets: { count: number, rows: Loan[]}}>(this.LOAN_BASE_URL_API + 'prets');
  }

  getLoansByUserId(userId: number) : Observable<{message: string, prets: { count: number, rows: Loan[]}}>{
    return this.httpClient.get<{message: string, prets: { count: number, rows: Loan[]}}>(this.LOAN_BASE_URL_API + 'prets/' + userId);
  }

  createLoan(loan: Loan) : Observable<{message: string, loan: Loan}>{
    return this.httpClient.post<{message: string, loan: Loan}>(this.LOAN_BASE_URL_API + 'pret', loan);
  }

  updateLoan(loan:Loan, loanId: number) : Observable<{message: string, loan: Loan}>{
    return this.httpClient.put<{message: string, loan: Loan}>(this.LOAN_BASE_URL_API + 'pret/' + loanId, loan);
  }

  deleteLoan(loanId: number) : Observable<{ message: string }>{
    return this.httpClient.delete<{ message: string }>(this.LOAN_BASE_URL_API + 'pret/' + loanId);
  }

  generatePDF(loanId: number) : Observable<{ message: string, filename: string}>{
    return this.httpClient.get<{ message: string, filename: string}>(this.LOAN_BASE_URL_API + 'generatePretPDF/' + loanId);
  }

  downloadPDF(path: string) : Observable<Blob>{
    return this.httpClient.get(this.LOAN_BASE_URL + path, { responseType: 'blob' });
  }

}
