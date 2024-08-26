import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, withLatestFrom, map } from 'rxjs';
import { Gender } from 'src/app/models/enums/Gender.enum';
import { Role } from 'src/app/models/enums/Role.enum';
import { User } from 'src/app/models/user.model';
import { AppState } from 'src/app/store/app.state';
import { addUser, updateUser, deleteUser } from 'src/app/store/user/user.actions';
import { selectUsersListRows, selectCurrentUser } from 'src/app/store/user/user.selector';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {

  roles: string[];
  genders: string[];

  usersList$: Observable<User[]>;
  closeResult: string;
  addingUserForm: FormGroup;
  editingUserForm: FormGroup;
  modalRef: NgbModalRef;
  userIdToDelete: number;
  
  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) {}

  ngOnInit(): void {
    this.roles = Object.values(Role);
    this.genders = Object.values(Gender);

    this.showUserListDependingOnItsStatus(null);
    this.initializeAddingUserForm();
  }
  
  initializeAddingUserForm() {
    this.addingUserForm = new FormGroup({
      userRef: new FormControl(this.generateUserReference(),[Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl(null, [Validators.required]), 
      gender: new FormControl(null, [Validators.required]), 
      jobTitle: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]), 
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{8}$/)]), 
    });
  }

  initializeEditingUserForm(user: User) {
    this.editingUserForm = new FormGroup({
      id: new FormControl(user.id, [Validators.required]),
      userRef: new FormControl(user.userRef,[Validators.required]),
      firstName: new FormControl(user.firstName, [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl(user.lastName, [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      role: new FormControl(user.role, [Validators.required]),
      gender: new FormControl(user.gender, [Validators.required]), 
      jobTitle: new FormControl(user.jobTitle, [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]), 
      phoneNumber: new FormControl(user.phoneNumber, [Validators.required, Validators.pattern(/^\+?\d{8}$/)]),
      enabled: new FormControl(user.enabled, [Validators.required])
    });
  }

  add(){
    this.store.dispatch(addUser({user: this.addingUserForm.value as User}));
  }

  edit(){
    this.store.dispatch(updateUser({user: this.editingUserForm.value as User}));
  }

  ableOrDisableUser(user: User){
    const { createdAt, updatedAt, ...restUser } = user;
    this.store.dispatch(updateUser({user: {...restUser as User, enabled: !user.enabled}}));
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true, backdropClass: 'custom-modal-backdrop' });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initializeAddingUserForm();
    });
  }

  specialOpen(content, user: User) {
    this.initializeEditingUserForm(user);
    this.open(content);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }

  generateUserReference() {
    return 'USR-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0').toString();
  }

  showUserListDependingOnItsStatus(enabled: boolean) {
    this.usersList$ = this.store.select(selectUsersListRows).pipe(
      withLatestFrom(this.store.select(selectCurrentUser)),
      map(([users, user]) => users ? enabled !== null ? users.filter(u => u.enabled === enabled && u.id !== user.id) : [...users.filter(u => u.id !== user.id)] : [])
    );
  }

  onConfirm() {
    this.store.dispatch(deleteUser({userId: this.userIdToDelete}));
    this.messageService.clear();
}

  onReject() {
      this.messageService.clear('delete');
  }

  deleteUser(userId){
    this.userIdToDelete = userId;
    this.messageService.clear();
    this.messageService.add({key: 'delete', sticky: true, severity:'custom', summary:'Do you confirm the delete of the user?', detail:'Confirm to proceed'});
  }
}
