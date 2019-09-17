import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showProgressBar: boolean = false;
  showOTPinput: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  async login() {
    this.showProgressBar = true;
    console.log("login function started", this.showProgressBar);

    // TODO: Write login function here.

    // this.showProgressBar = false;
    // await console.log("login end", this.showProgressBar);


    await setInterval(() => {
      console.log("number sent");
      this.showProgressBar = false;

    },
      3000)
  }

}
