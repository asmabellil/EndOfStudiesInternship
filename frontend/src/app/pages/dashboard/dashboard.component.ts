import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, tap, withLatestFrom } from 'rxjs';
import { CheckIn } from 'src/app/models/check-in.model';
import { User } from 'src/app/models/user.model';
import { AppState } from 'src/app/store/app.state';
import { selectCheckInsList } from 'src/app/store/checkIn/check-in.selectors';
import { selectLeavesList, selectLeavesListCount } from 'src/app/store/leaves/leaves.selector';
import { selectAllLoansList, selectAllLoansListCount } from 'src/app/store/loan/loan.selectors';
import { selectUsersListCount, selectUsersListRows } from 'src/app/store/user/user.selector';
import { getUserFullName, parseDate } from 'src/app/utils/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  numberOfUser$: Observable<number>;
  numberOfLeavesRequests$: Observable<number>;
  numberOfLoansRequests$: Observable<number>;

  usersStatsNumber$: Observable<{ activeUsers: number, InactiveUsers: number, admins: number, employees: number, male: number, female: number}>;
  leavesStatsNumber$: Observable<{ pending: number, accepted: number, rejected: number, over10: number, under10: number }>;
  loansStatsNumber$: Observable<{ benefits:number, acceptedAmount: number, pending: number, accepted: number, rejected: number }>;

  checkInsList$: Observable<{ user: User, averageWorkingHours: {hours: number, minutes: number}, unorganized: number}[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {  
    this.numberOfUser$ = this.store.select(selectUsersListCount);
    this.numberOfLeavesRequests$ = this.store.select(selectLeavesListCount);
    this.numberOfLoansRequests$ = this.store.select(selectAllLoansListCount);

    this.usersStatsNumber$ = this.store.select(selectUsersListRows).pipe(
      map(usersList => {
        const activeUsers = !!usersList ? usersList.filter(user => user.enabled).length : 0;
        const InactiveUsers = !!usersList ? usersList.filter(user => !user.enabled).length : 0;
        const admins = !!usersList ? usersList.filter(user => user.role === 'Admin').length : 0;
        const employees = !!usersList ? usersList.filter(user => user.role === 'Employee').length : 0;
        const male = !!usersList ? usersList.filter(user => user.gender === 'Male').length : 0;
        const female = !!usersList ? usersList.filter(user => user.gender === 'Female').length : 0;

        return { activeUsers, InactiveUsers, admins, employees, male, female };
      })
    );

    this.leavesStatsNumber$ = this.store.select(selectLeavesList).pipe(
      map(leavesList => {
        const pending = !!leavesList ? leavesList.filter(leave => leave.status === 'Pending').length : 0;
        const accepted = !!leavesList ? leavesList.filter(leave => leave.status === 'Valid').length : 0;
        const rejected = !!leavesList ? leavesList.filter(leave => leave.status === 'Invalid').length : 0;
        const over10 = !!leavesList ? leavesList.filter(leave => leave.daysNumber > 10).length : 0;
        const under10 = !!leavesList ? leavesList.filter(leave => leave.daysNumber <= 10).length : 0;

        return { pending, accepted, rejected, over10, under10 };
      })
    );

    this.loansStatsNumber$ = this.store.select(selectAllLoansList).pipe(
      map(loansList => {
        const benefits = !!loansList ? loansList.reduce((acc, loan) => acc + (loan.montantARemb - loan.montantPret), 0) : 0;
        const acceptedAmount = !!loansList ? loansList.filter(loan => loan.status === 'Accepted').reduce((acc, loan) => acc + loan.montantPret, 0) : 0;
        const pending = !!loansList ? loansList.filter(loan => loan.status === 'Pending').length : 0;
        const accepted = !!loansList ? loansList.filter(loan => loan.status === 'Accepted').length : 0;
        const rejected = !!loansList ? loansList.filter(loan => loan.status === 'Rejected').length : 0;

        return { benefits, acceptedAmount, pending, accepted, rejected };
      })
    )


    this.checkInsList$ = this.store.select(selectCheckInsList).pipe(
      withLatestFrom(this.store.select(selectUsersListRows)),
      map(([checkIns, usersList]) => {
        const checkInsGroupedByUser = checkIns.reduce((acc, checkIn) => {
          if (!acc[checkIn.userId]) {
            acc[checkIn.userId] = [];
          }
          acc[checkIn.userId].push(checkIn);
          return acc;
        }, {} as { [userId: string]: CheckIn[] });

        return Object.entries(checkInsGroupedByUser).map(([userId, checkIns]) => ({ user: usersList.find(user => user.id === parseInt(userId)), checkIns }));
      }),
      map(checkInsGroupedByUserList => {
        return checkInsGroupedByUserList.map(checkInsGroupedByUser => {
          const checkInsGroupedByDay = checkInsGroupedByUser.checkIns.reduce((acc, checkIn) => {
            const checkInDateString = new Date(checkIn.checkInDate).toLocaleDateString('en-GB'); 
            if (!acc[checkInDateString]) {
              acc[checkInDateString] = [];
            }
            acc[checkInDateString].push(checkIn);
            return acc;
          }, {} as { [date: string]: CheckIn[] });

          const finalList = { 
            user: checkInsGroupedByUser.user, 
            checkIns: Object.entries(checkInsGroupedByDay).map(([date, checkIns]) => ({ date: parseDate(date), checkIns })) 
          };

          let unorganized = 0;

          const workingHoursList = finalList.checkIns.map(checkInGroupedByDate => {
            const ins = checkInGroupedByDate.checkIns.filter(checkIn => checkIn.checkInType === 'IN').sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
            const outs = checkInGroupedByDate.checkIns.filter(checkIn => checkIn.checkInType === 'OUT').sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());

            if(this.isDayUnorganized(ins, outs)) {
              unorganized++;
              return null;
            }

            return ins.reduce((acc, checkIn, i) => acc + new Date(outs[i].checkInDate).getTime() - new Date(checkIn.checkInDate).getTime(), 0);
          });

          const averageWorkingHours = workingHoursList.reduce((acc, workingHours) => acc + workingHours, 0) / workingHoursList.length;
          

          return {user: finalList.user, averageWorkingHours: averageWorkingHours !== 0 ? this.millisecondsToTime(averageWorkingHours) : null , unorganized};
        })
      })
    );
  }

  isDayUnorganized(ins: CheckIn[], outs: CheckIn[]): boolean {
    if(ins.length !== outs.length) {
      return true;
    }

    let i = 1;
    let j = 0;
    while(i < ins.length && j < outs.length) {
      if(new Date(ins[i].checkInDate).getTime() < new Date(outs[j].checkInDate).getTime()) {
        return true;
      }
      i++;
      j++;
    }

    return false;
  }

  millisecondsToTime(milliseconds: number): { hours: number, minutes: number } {
    const totalHours = milliseconds / (1000 * 60 * 60);
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return { hours, minutes };
  }
  
  getPourcentatgeOfHours(averageWorkingHours: { hours: number, minutes: number }): number {
    const percentage = !!averageWorkingHours ? (averageWorkingHours.hours + averageWorkingHours.minutes / 60) / 8 * 100 : 0;
    return percentage > 100 ? 100 : percentage;
  }

  getProgressBarClass(percentage: number): string {
    if (percentage < 40) {
      return 'bg-gradient-danger';
    } else if (percentage >= 40 && percentage < 80) {
      return 'bg-gradient-warning';
    } else {
      return 'bg-gradient-success';
    }
  }

  getUserFullName = getUserFullName;
}
