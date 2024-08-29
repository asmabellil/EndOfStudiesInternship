import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { LeaveStatus } from 'src/app/models/enums/leave-status.enum';
import { LeaveType } from 'src/app/models/enums/leave-type.enum';
import { Leave } from 'src/app/models/leave.model';
import { AppState } from 'src/app/store/app.state';
import { createLeaveForUser, deleteLeave, getLeavesByUserId, updateLeave } from 'src/app/store/leaves/leaves.actions';
import { selectCurrentUserLeaves } from 'src/app/store/leaves/leaves.selector';
import { selectCurrentUserId } from 'src/app/store/user/user.selector';

@Component({
  selector: 'app-employee-leaves',
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss']
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
      leaveType: new FormControl('Annual', [Validators.required]),
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
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    this.editingLeaveForm = new FormGroup({
      id: new FormControl(leave.id, [Validators.required]),
      userId: new FormControl(leave.userId, [Validators.required]),
      status: new FormControl(leave.status, [Validators.required]),
      leaveType: new FormControl(leave.leaveType, [Validators.required]),
      startDate: new FormControl(new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()), [Validators.required]),
      endDate: new FormControl(new NgbDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()), [Validators.required]),
      startDateSpecification: new FormControl(leave.startDateSpecification, [Validators.required]),
      endDateSpecification: new FormControl(leave.endDateSpecification, [Validators.required]),
      daysNumber: new FormControl(leave.daysNumber, [Validators.required]),
      reason: new FormControl(leave.reason)
    });
    
    this.editingLeaveForm.get('leaveType').valueChanges.subscribe(changes => this.leaveToUpdate.leaveType = changes);
    this.editingLeaveForm.get('startDateSpecification').valueChanges.subscribe(changes => this.leaveToUpdate.startDateSpecification = changes);
    this.editingLeaveForm.get('endDateSpecification').valueChanges.subscribe(changes => this.leaveToUpdate.endDateSpecification = changes);
    this.editingLeaveForm.get('reason').valueChanges.subscribe(changes => this.leaveToUpdate.reason = changes);
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
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true, backdropClass: 'custom-modal-backdrop' });
    
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
    this.messageService.add({key: 'delete', sticky: true, severity:'custom', summary:'Do you confirm the delete of the leave request?', detail:'Confirm to proceed'});
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
    const {startDate, endDate, ...restLeaveFormValues} = this.addingLeaveForm.getRawValue();
    this.store.dispatch(createLeaveForUser({ leave: {
      ...restLeaveFormValues, 
      startDate: new Date(startDate.year, startDate.month - 1, startDate.day),
      endDate: new Date(endDate.year, endDate.month - 1, endDate.day),
   } as Leave }));
  }

  edit(){
    const {startDate: formStartDate, endDate: formEndDate} = this.editingLeaveForm.getRawValue();


    this.store.dispatch(updateLeave({ leave: {
      ...this.leaveToUpdate,
      startDate: new Date(formStartDate.year, formStartDate.month - 1, formStartDate.day),
      endDate: new Date(formEndDate.year, formEndDate.month - 1, formEndDate.day),
    }, refreshAll: false}))
  }
}
