import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest, map } from 'rxjs';
import { CheckIn } from 'src/app/models/check-in.model';
import { CheckInType } from 'src/app/models/enums/check-in-type.enum';
import { User } from 'src/app/models/user.model';
import { AppState } from 'src/app/store/app.state';
import { getAllCheckIns, changeCheckInSelectedUser, createCheckInForUser } from 'src/app/store/checkIn/check-in.actions';
import { selectCheckInSelectedUser, selectCheckInsList } from 'src/app/store/checkIn/check-in.selectors';
import { selectUserRole, selectUsersListRows } from 'src/app/store/user/user.selector';
import { getUserFullName, isSameDay } from 'src/app/utils/utils';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-check-ins',
  templateUrl: './admin-check-ins.component.html',
  styleUrls: ['./admin-check-ins.component.scss']
})
export class AdminCheckInsComponent implements OnInit {

  checkInsList$: Observable<CheckIn[]>;
  brutCheckInsList$ : Observable<{date: Date, checkIns: CheckIn[]}[]>;
  netCheckInsList$ : Observable<{date: Date, checkIns: CheckIn[]}[]>;

  usersList$ : Observable<User[]>;
  selectedUser$: Observable<User>;
  currentUserRole$: Observable<string>;

  checkInFormGroup: FormGroup;
  checkInTypes: string[];
  modalRef: NgbModalRef;
  closeResult: string;
  searchDate: NgbDate;

  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) { }

  ngOnInit(): void {
    this.checkInTypes = Object.values(CheckInType);
    this.initializeCheckInForm();

    this.usersList$ = this.store.select(selectUsersListRows);
    this.selectedUser$ = this.store.select(selectCheckInSelectedUser);
    this.currentUserRole$ = this.store.select(selectUserRole);

    this.checkInsList$ = combineLatest([this.store.select(selectCheckInsList), this.selectedUser$]).pipe(
      map(([checkIns, selectedUser]) => {
        return checkIns.filter(checkIn => checkIn.userId === selectedUser?.id);
      })
    );

    this.setPointingsLists(null);
  }

  setPointingsLists(searchDate: NgbDate){
    const filterDate = !!searchDate ? new Date(searchDate.year, searchDate.month - 1, searchDate.day) : null;

    this.brutCheckInsList$ = this.checkInsList$.pipe(
      map(checkIns => {
        const result = this.groupCheckInsByDate(this.sortCheckInsByDates(checkIns));

        if(!!filterDate){
          return result.filter(checkInsGroup => isSameDay(checkInsGroup.date, filterDate));
        }

        return result;
      })
    );

    this.netCheckInsList$ = this.brutCheckInsList$.pipe(
      map(checkInsList => checkInsList.map(checkInsGroup => this.mapNetCheckInsList(checkInsGroup)))
    );
  }

  mapNetCheckInsList(checkInsGroup: {date: Date, checkIns: CheckIn[]}){
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
  }

  initializeCheckInForm(){
    this.checkInFormGroup = new FormGroup({
      checkInTime: new FormControl('', [Validators.required]),
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
      const existingGroup = acc.find(group => isSameDay(group.date, checkIn.checkInDate));
  
      if (existingGroup) {
        existingGroup.checkIns.push(checkIn);
      } else {
        acc.push({ date: checkIn.checkInDate, checkIns: [checkIn] });
      }
  
      return acc;
    }, []);
  }

  sortCheckInsByDates(checkIns: CheckIn[]): CheckIn[] {
    return checkIns.sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'md', centered: true, backdropClass: 'custom-modal-backdrop' });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initializeCheckInForm();
    });
  }

  add(){
    const formValues = this.checkInFormGroup.getRawValue()
    const checkInDate = new Date(formValues.checkInDate.year, formValues.checkInDate.month - 1, formValues.checkInDate.day, formValues.checkInTime.hour, formValues.checkInTime.minute, formValues.checkInTime.second);
    
    this.store.dispatch(createCheckInForUser({ checkIn: { checkInType: formValues.checkInType, checkInDate: checkInDate } as CheckIn  }));
    this.modalRef.close();
    this.initializeCheckInForm();
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

        jsonData.forEach((row: string[]) => {
          this.store.dispatch(createCheckInForUser({ checkIn: { userId: parseInt(row[0]), checkInType: row[1], checkInDate: new Date(row[2]) } as CheckIn }));
        });

        fileInput.value = '';
      };
      reader.readAsArrayBuffer(file);
    }
  }

  getUserFullName=getUserFullName;

}
