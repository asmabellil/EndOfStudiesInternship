import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { AppState } from '../store/app.state';
import { selectUsersListRows } from '../store/user/user.selector';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../models/enums/Role.enum';
import { Gender } from '../models/enums/Gender.enum';
import { addUser } from '../store/user/user.actions';


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
  addingUserForm: FormGroup;
  
  constructor(private store: Store<AppState>, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.roles = Object.values(Role);
    this.genders = Object.values(Gender);
    this.userToAdd = new User();
    this.userToAdd.role = null;
    this.userToAdd.gender = null;

    this.usersList$ = this.store.select(selectUsersListRows).pipe(
      map(users => users ? [...users] : [])
    );

    this.addingUserForm = new FormGroup({
      userRef: new FormControl(this.generateUserReference(),[Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]), 
      gender: new FormControl(''), 
      jobTitle: new FormControl('', [Validators.pattern(/^[a-zA-Z]*$/)]), 
      phoneNumber: new FormControl('', [Validators.pattern(/^\+?\d{8}$/)]), 
    });
  }

  add(){
    this.store.dispatch(addUser({user: this.userToAdd}));
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'modal-mini', size: 'lg', centered: true }).result.then((result) => {
        this.closeResult = 'Closed with: $result';
    }, (reason) => {
        this.closeResult = 'Dismissed $this.getDismissReason(reason)';
        this.userToAdd = new User();
        this.userToAdd.role = null;
        this.userToAdd.gender = null;
        this.generateUserReference();
    });
   
  }

  generateUserReference() {
    this.userToAdd.userRef = 'USR-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0').toString();
  }


}
