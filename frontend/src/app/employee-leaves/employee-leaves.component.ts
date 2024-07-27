import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { LeaveStatus } from '../models/enums/leave-status.enum';
import { LeaveType } from '../models/enums/leave-type.enum';
import { Leave } from '../models/leave.model';
import { AppState } from '../store/app.state';
import { createLeaveForUser, deleteLeave, getLeavesByUserId, updateLeave } from '../store/leaves/leaves.actions';
import { selectCurrentUserLeaves } from '../store/leaves/leaves.selector';
import { selectCurrentUserId } from '../store/user/user.selector';

@Component({
  selector: 'app-employee-leaves',
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.css']
})
export class EmployeeLeavesComponent implements OnInit {

  leavesList$: Observable<Leave[]>;
  modalRef: NgbModalRef;
  closeResult: string;
  leaveIdToDelete: number;
  leaveToUpdate: Leave;

  userId$ : Observable<number>;
  addingLeaveForm: FormGroup;
  editingLeaveForm: FormGroup;
  leavesTypes: string[];

  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) {
   }

  ngOnInit(): void {
    this.leavesTypes = Object.values(LeaveType);
    this.initializeAddingLeaveForm();

    this.userId$ = this.store.select(selectCurrentUserId);
    this.userId$.subscribe(userId => this.store.dispatch(getLeavesByUserId({userId})));
    this.leavesList$ = this.store.select(selectCurrentUserLeaves);
  }

  initializeAddingLeaveForm(){
    this.addingLeaveForm = new FormGroup({
      status: new FormControl(LeaveStatus.PENDING, [Validators.required]),
      leaveType: new FormControl(null, [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      startDateSpecification: new FormControl('Morning Leave', [Validators.required]),
      endDateSpecification: new FormControl('Afternoon End', [Validators.required]),
      reason: new FormControl('')
    })
  }

  initializeEditingLeaveForm(leave: Leave){
    const {createdAt, updatedAt, ...leaveRest} = leave;
    this.leaveToUpdate = leaveRest as Leave;

    this.editingLeaveForm = new FormGroup({
      id: new FormControl(leave.id, [Validators.required]),
      userId: new FormControl(leave.userId, [Validators.required]),
      status: new FormControl(leave.status, [Validators.required]),
      leaveType: new FormControl(leave.leaveType, [Validators.required]),
      startDate: new FormControl(moment(leave.startDate).format('DD/MM/YYYY'), [Validators.required]),
      endDate: new FormControl(moment(leave.endDate).format('DD/MM/YYYY'), [Validators.required]),
      startDateSpecification: new FormControl(leave.startDateSpecification, [Validators.required]),
      endDateSpecification: new FormControl(leave.endDateSpecification, [Validators.required]),
      daysNumber: new FormControl(leave.daysNumber, [Validators.required]),
      reason: new FormControl(leave.reason)
    });
    
    this.editingLeaveForm.get('leaveType').valueChanges.subscribe(changes => this.leaveToUpdate.leaveType = changes);
    this.editingLeaveForm.get('startDateSpecification').valueChanges.subscribe(changes => this.leaveToUpdate.startDateSpecification = changes);
    this.editingLeaveForm.get('endDateSpecification').valueChanges.subscribe(changes => this.leaveToUpdate.endDateSpecification = changes);
    this.editingLeaveForm.get('reason').valueChanges.subscribe(changes => this.leaveToUpdate.reason = changes);
    this.editingLeaveForm.get('startDate').valueChanges.subscribe(changes => this.leaveToUpdate.startDate = changes);
    this.editingLeaveForm.get('endDate').valueChanges.subscribe(changes => this.leaveToUpdate.endDate = changes);
  }

  get addingLeaveFormStartDate(): Date | null {
    return this.addingLeaveForm.get('startDate')?.value !== '' ? this.addingLeaveForm.get('startDate')?.value : null;
  }

  get startDateSpecification(){
    return this.editingLeaveForm.get('startDateSpecification').value;
  }

  get endDateSpecification(){
    return this.editingLeaveForm.get('endDateSpecification').value;
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initializeAddingLeaveForm();
    });
  }

  specialOpen(content, leave: Leave) {
    this.initializeEditingLeaveForm(leave);
    this.open(content);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }

  onConfirm() {
    this.store.dispatch(deleteLeave({ leaveId: this.leaveIdToDelete }));
    this.messageService.clear();
}

  onReject() {
      this.messageService.clear('delete');
  }

  deleteLeave(leaveId){
    this.leaveIdToDelete = leaveId;
    this.messageService.clear();
    this.messageService.add({key: 'delete', sticky: true, severity:'custom', summary:'Do you confirm the delete of the user?', detail:'Confirm to proceed'});
  }

  onAddingCheckboxChange(event: Event, formControlName: string): void {
    const checkbox = event.target as HTMLInputElement;
    this.addingLeaveForm.get(formControlName)?.setValue(!checkbox.checked ? 
      (formControlName === 'startDateSpecification' ? 'Morning Leave' : 'Afternoon End') : 
      (formControlName === 'startDateSpecification' ? 'Afternoon Leave' : 'Evening End')
    );
  }

  onEditingCheckboxChange(event: Event, formControlName: string): void {
    const checkbox = event.target as HTMLInputElement;
    this.editingLeaveForm.get(formControlName)?.setValue(!checkbox.checked ? 
      (formControlName === 'startDateSpecification' ? 'Morning Leave' : 'Afternoon End') : 
      (formControlName === 'startDateSpecification' ? 'Afternoon Leave' : 'Evening End')
    );
  }

  add(){
    this.store.dispatch(createLeaveForUser({ leave: this.addingLeaveForm.getRawValue() as Leave }));
  }

  edit(){
    this.store.dispatch(updateLeave({ leave: this.leaveToUpdate, refreshAll: false}))
  }
}
