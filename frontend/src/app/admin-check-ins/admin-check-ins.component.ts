import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { CheckIn } from '../models/check-in.model';
import { CheckInType } from '../models/enums/check-in-type.enum';
import { User } from '../models/user.model';
import { AppState } from '../store/app.state';
import { changeCheckInSelectedUser, createCheckInForUser, getAllCheckIns } from '../store/checkIn/check-in.actions';
import { selectCheckInSelectedUser, selectCheckInsList } from '../store/checkIn/check-in.selectors';
import { selectUsersListRows } from '../store/user/user.selector';
import { getUserFullName } from '../utils/utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-check-ins',
  templateUrl: './admin-check-ins.component.html',
  styleUrls: ['./admin-check-ins.component.css']
})
export class AdminCheckInsComponent implements OnInit {

  checkInsList$: Observable<CheckIn[]>;
  brutCheckInsList$ : Observable<{date: Date, checkIns: CheckIn[]}[]>;
  netCheckInsList$ : Observable<{date: Date, checkIns: CheckIn[]}[]>;

  usersList$ : Observable<User[]>;
  selectedUser$: Observable<User>;

  checkInFormGroup: FormGroup;
  checkInTypes: string[];
  modalRef: NgbModalRef;
  closeResult: string;

  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) { }

  ngOnInit(): void {
    this.checkInTypes = Object.values(CheckInType);
    this.initializeCheckInForm();

    this.store.dispatch(getAllCheckIns());

    this.usersList$ = this.store.select(selectUsersListRows);
    this.selectedUser$ = this.store.select(selectCheckInSelectedUser);

    this.checkInsList$ = combineLatest([this.store.select(selectCheckInsList), this.selectedUser$]).pipe(
      map(([checkIns, selectedUser]) => {
        return checkIns.filter(checkIn => checkIn.userId === selectedUser?.id);
      })
    );

    this.brutCheckInsList$ = this.checkInsList$.pipe(map(checkIns => this.groupCheckInsByDate(this.sortCheckInsByDates(checkIns))));

    this.netCheckInsList$ = this.brutCheckInsList$.pipe(
      map(checkInsList => checkInsList.map(checkInsGroup => {
        checkInsGroup.checkIns = this.sortCheckInsByDates(checkInsGroup.checkIns);
        let lastOUT;

        if(checkInsGroup.checkIns[checkInsGroup.checkIns.length-1].checkInType === CheckInType.OUT){
          const lastCheckIn = checkInsGroup.checkIns[checkInsGroup.checkIns.length-1];
          lastOUT = lastCheckIn.checkInType === CheckInType.OUT ? lastCheckIn : null;

        }

        checkInsGroup.checkIns = [checkInsGroup.checkIns.find(checkIn => checkIn.checkInType === CheckInType.IN)];

        if(!!lastOUT)
          checkInsGroup.checkIns.push(lastOUT);

        return checkInsGroup;
      }))
    );
  }

  initializeCheckInForm(){
    this.checkInFormGroup = new FormGroup({
      checkInDate: new FormControl('', [Validators.required]),
      checkInType: new FormControl(null, [Validators.required])
    });
  }

  changeSelectedUser(userId: string, usersList: User[]) { 
    const user = usersList.find(user => user.id === parseInt(userId));
    this.store.dispatch(changeCheckInSelectedUser({ user }));
  }

  groupCheckInsByDate(checkInsList: CheckIn[]): {date: Date, checkIns: CheckIn[]}[] {
    return checkInsList.reduce((acc, checkIn) => {
      const existingGroup = acc.find(group => this.isSameDay(group.date, checkIn.checkInDate));
  
      if (existingGroup) {
        existingGroup.checkIns.push(checkIn);
      } else {
        acc.push({ date: checkIn.checkInDate, checkIns: [checkIn] });
      }
  
      return acc;
    }, []);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    date1 = new Date(date1);
    date2 = new Date(date2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  sortCheckInsByDates(checkIns: CheckIn[]): CheckIn[] {
    return checkIns.sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'md', centered: true });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initializeCheckInForm();
    });
  }

  add(){
    this.store.dispatch(createCheckInForUser({ checkIn: this.checkInFormGroup.value }));
    this.modalRef.close();
  }

  onFileUpload(event: any) {
    const fileInput = event.target;
    const file: File = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        const processedData = jsonData.map((row: any) => {
          const dateColumnIndex = row.length - 1; // Index of the last column
          row[dateColumnIndex] = this.excelDateToJSDate(row[dateColumnIndex]);
          return row;
        });
  
        for(const row of processedData){
          this.store.dispatch(createCheckInForUser({ checkIn: { userId: row[0], checkInType: row[1], checkInDate: row[2] } as CheckIn }));
        }
  
        // Reset the file input
        fileInput.value = '';
      };
      reader.readAsArrayBuffer(file);
    }
  }

  excelDateToJSDate(serial: number): Date {
    const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts on December 30, 1899
    const days = Math.floor(serial);
    const milliseconds = Math.round((serial - days) * 24 * 60 * 60 * 1000);
    const correctedMilliseconds = milliseconds - 2785000; // Subtract 46 minutes and 25 seconds
    return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000 + correctedMilliseconds);
  }

  getUserFullName=getUserFullName;

}
