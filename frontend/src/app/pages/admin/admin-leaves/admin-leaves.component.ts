import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, withLatestFrom, map } from 'rxjs';
import { Leave } from 'src/app/models/leave.model';
import { AppState } from 'src/app/store/app.state';
import { getAllLeaves, updateLeave } from 'src/app/store/leaves/leaves.actions';
import { selectLeavesList } from 'src/app/store/leaves/leaves.selector';
import { selectUsersListRows } from 'src/app/store/user/user.selector';
import { getUserFullName } from 'src/app/utils/utils';

@Component({
  selector: 'app-admin-leaves',
  templateUrl: './admin-leaves.component.html',
  styleUrls: ['./admin-leaves.component.scss']
})
export class AdminLeavesComponent implements OnInit {

  leavesList$ : Observable<{leaveDetails: Leave, userFullName: string}[]>;
  rejectionReason: string;

  constructor(private store: Store<AppState>, private messageService: MessageService) { }

  ngOnInit(): void {
    this.rejectionReason ='';

    this.leavesList$ = this.store.select(selectLeavesList).pipe(
      withLatestFrom(this.store.select(selectUsersListRows)),
      map(([leavesList, usersList]) => leavesList.map(leave => ({
        leaveDetails: leave, userFullName: getUserFullName(usersList.filter(u => u.id === leave.userId)[0])
      })))
    );
  }

  onConfirm(data: any) {
    const {createdAt, updatedAt, ...toUpdateLeave} = data.leave
    this.store.dispatch(updateLeave({ leave: { ...toUpdateLeave, status: data.status, rejectionReason: this.rejectionReason }, refreshAll: true}));
    this.messageService.clear();
}

  onReject() {
      this.messageService.clear('statusConfirmation');
  }

  acceptOrReject(leave: Leave, status: string){
    this.rejectionReason = '';
    this.messageService.clear();
    this.messageService.add({
      key: 'statusConfirmation', 
      sticky: true, 
      severity:'custom', 
      summary:'Do you confirm the ' + (status === 'Valid' ? 'accept' : 'reject') + ' of the leave request?', detail:'Confirm to proceed',
      data: { status, leave }
    });
  }
}
