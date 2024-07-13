import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { Gender } from '../models/enums/Gender.enum';
import { Role } from '../models/enums/Role.enum';
import { User } from '../models/user.model';
import { AppState } from '../store/app.state';
import { addUser, deleteUser, updateUser } from '../store/user/user.actions';
import { selectUsersListRows } from '../store/user/user.selector';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roles: string[];
  genders: string[];

  usersList$: Observable<User[]>;
  closeResult: string;
  userToAdd: User;
  userToModify: User;
  addingUserForm: FormGroup;
  editingUserForm: FormGroup;
  modalRef: NgbModalRef;
  userIdToDelete: number;
  
  constructor(private store: Store<AppState>, private modalService: NgbModal, private messageService: MessageService) {}

  ngOnInit(): void {
    this.roles = Object.values(Role);
    this.genders = Object.values(Gender);
    
    this.initiateUserToAdd();
    this.userToModify = new User();

    this.usersList$ = this.store.select(selectUsersListRows).pipe(
      map(users => users ? [...users] : [])
    );

    this.addingUserForm = new FormGroup({
      userRef: new FormControl('',[Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]), 
      gender: new FormControl('', [Validators.required]), 
      jobTitle: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]), 
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{8}$/)]), 
    });

    this.editingUserForm = new FormGroup({
      userRef: new FormControl('',[Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]), 
      jobTitle: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]), 
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{8}$/)]), 
    });
  }

  add(){
    this.store.dispatch(addUser({user: this.userToAdd}));
    this.initiateUserToAdd();
  }

  edit(){
    this.store.dispatch(updateUser({user: this.userToModify}));
    this.userToModify = new User();
  }

  ableOrDisableUser(user: User){
    this.store.dispatch(updateUser({user: {...user, enabled: !user.enabled}}));
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true });
    
    this.modalRef.result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.initiateUserToAdd();
    });
  }

  specialOpen(content, user: User) {
    this.setUserToModify(user);
    this.open(content);
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close(); 
    }
  }

  generateUserReference() {
    this.userToAdd.userRef = 'USR-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0').toString();
  }

  initiateUserToAdd() {
    this.userToAdd = new User();
    this.userToAdd.role = null;
    this.userToAdd.gender = null;
    this.generateUserReference();
  }
  
  setUserToModify(user: User) {
    this.userToModify.id = user.id;
    this.userToModify.userRef = user.userRef;
    this.userToModify.firstName = user.firstName;
    this.userToModify.lastName = user.lastName;
    this.userToModify.email = user.email;
    this.userToModify.role = user.role;
    this.userToModify.gender = user.gender;
    this.userToModify.jobTitle = user.jobTitle;
    this.userToModify.phoneNumber = user.phoneNumber;
  }

  showUserListDependingOnItsStatus(enabled: boolean) {
    this.usersList$ = this.store.select(selectUsersListRows).pipe(
      // map(users => !!enabled ? users.filter(user => user.enabled === enabled) : users ? [...users] : [])
      map(users => users ? enabled !== null ? users.filter(user => user.enabled === enabled) : [...users] : [])
    );
  }

  onConfirm() {
    this.store.dispatch(deleteUser({userId: this.userIdToDelete}));
    this.messageService.clear();
}

onReject() {
    this.messageService.clear('c');
}

  deleteUser(userId){
    this.userIdToDelete = userId;
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'custom', summary:'Do you confirm the delete of the user?', detail:'Confirm to proceed'});
  }
}
