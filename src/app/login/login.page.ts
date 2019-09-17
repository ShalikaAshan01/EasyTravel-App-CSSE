import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showProgressBar: boolean = false;
  showOTPinput: boolean = false;

  phoneNumber: any;
  otp: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {

    this.showProgressBar = true;
    console.log("login function started", this.showProgressBar);

    // TODO: Write login function here.

    // this.showProgressBar = false;
    // console.log("login end", this.showProgressBar);


    setTimeout(() => {
      console.log("number sent", this.phoneNumber);
      this.showProgressBar = false;
      this.showOTPinput = true;
      console.log("login end", this.showProgressBar);

    }, 3000)
  }

  sendOTP() {

    this.showProgressBar = true;
    console.log("otp confirm function started", this.showProgressBar);

    // TODO: Write OTP function here.

    // this.showProgressBar = false;
    // console.log("login end", this.showProgressBar);


    setTimeout(() => {
      console.log("otp confirm sent", this.otp);
      this.showProgressBar = false;
      console.log("otp confirm end", this.showProgressBar);

      // TODO: Navigate to Home.
      this.showOTPinput = false;
      this.router.navigate(['/home']);

    }, 3000)
  }

}
