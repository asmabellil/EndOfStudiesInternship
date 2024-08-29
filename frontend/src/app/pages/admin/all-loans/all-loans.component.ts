import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { map, Observable, withLatestFrom } from 'rxjs';
import { Loan } from 'src/app/models/loan.model';
import { User } from 'src/app/models/user.model';
import { AppState } from 'src/app/store/app.state';
import { getAllLoans, updateLoan } from 'src/app/store/loan/loan.actions';
import { selectAllLoansList } from 'src/app/store/loan/loan.selectors';
import { selectUsersListRows } from 'src/app/store/user/user.selector';
import { getUserFullName } from 'src/app/utils/utils';

@Component({
  selector: 'app-all-loans',
  templateUrl: './all-loans.component.html',
  styleUrls: ['./all-loans.component.scss']
})
export class AllLoansComponent implements OnInit {

  loansList$: Observable<{user: User, loanDetails: Loan}[]>;

  constructor(private store: Store<AppState>, private messageService: MessageService) { }

  ngOnInit(): void {
    this.store.dispatch(getAllLoans());

    this.loansList$ = this.store.select(selectAllLoansList).pipe(
      withLatestFrom(this.store.select(selectUsersListRows)),
      map(([loansList, usersList]) => {
        return loansList.map(loan => ({user: usersList.find(user => user.id === loan.userId), loanDetails: loan}));
    }));
  }

  onConfirm(data: any) {
    this.store.dispatch(updateLoan({ loan: { ...data.loan, status: data.status } }));
    this.messageService.clear();
}

  onReject() {
      this.messageService.clear('statusConfirmation');
  }

  acceptOrReject(loan: Loan, status: string){
    this.messageService.clear();
    this.messageService.add({
      key: 'statusConfirmation', 
      sticky: true, 
      severity:'custom', 
      summary:'Do you confirm the ' + (status === 'Accepted' ? 'accept' : 'reject') + ' of the loan request?', detail:'Confirm to proceed',
      data: { status, loan }
    });
  }

  getUserFullName = getUserFullName;
}
