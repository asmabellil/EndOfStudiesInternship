import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var handleSignout: any; 

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  constructor(private router: Router) {}
  userProfile: any;
  ngOnInit() {
    this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    console.log(this.userProfile);

    // call user service connect with gmail
    
  }
  handleSignOut() {
    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
    });
  }

}
