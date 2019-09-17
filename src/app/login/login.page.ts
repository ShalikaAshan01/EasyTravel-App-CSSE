import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { UserServiceService } from '../services/user-service.service'
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showProgressBar: boolean = false;
  showOTPinput: boolean = false;

  phoneNumber: any;
  otp: number;

  verificationID: string = "";
  number: string;
  userAccount: any = [];

  constructor(private router: Router,
    public navCtrl: NavController, 
    public firebaseAuthentication: FirebaseAuthentication, 
    private userService: UserServiceService, 
    private storage: Storage, 
    private firestore: AngularFirestore) {
    firebaseAuthentication.signOut();
    firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      if (user) {
        this.firestore.collection('passengers').doc(user.uid).valueChanges()
          .subscribe(_user => {
            if (_user == undefined || _user == null) {
              this.userService.createUser(user.uid, this.number).then(resp => {
                var userAcc = {
                  userId: user.uid,
                  firstName: null, 
                  lastName: null,
                  accountBalance: 0,
                  nic: null,
                  phoneNumber: this.number,
                  holdBalance: 0,
                  status: 'inactive'
                }
                storage.set('userId', user.uid);
                storage.set('user', userAcc);
                storage.get('user').then((val) => {
                  console.log('User is', val);
                });
              });
            }
            else{
              this.userAccount = _user;
              var userAcc = {
                userId: user.uid,
                firstName: this.userAccount.firstName, 
                lastName: this.userAccount.lastName,
                accountBalance: this.userAccount.accountBalance,
                nic: this.userAccount.nic,
                phoneNumber: this.userAccount.phoneNumber,
                holdBalance: this.userAccount.holdBalance,
                status: this.userAccount.status
              }
              console.log(userAcc);
              storage.set('userId', user.uid);
              storage.set('user', userAcc);
              storage.get('user').then((val) => {
                console.log('User is', val);
              });
            }
          });
        navCtrl.navigateRoot(['/home']);
        console.log(user.uid);
      } else {
        navCtrl.navigateRoot(['']);
      }
    });
  }

  ngOnInit() {
  }

  login() {
    this.number = "+94"+this.phoneNumber.toString();
    this.showProgressBar = true;
    console.log("login function started", this.showProgressBar);

    console.log(this.number);
    //this.number = "+94715115565";
    this.firebaseAuthentication.verifyPhoneNumber(this.number, 30000).then((verificationID) => {
      console.log(verificationID);
      this.verificationID = verificationID;
    }).catch((error) => {
      console.log(error);
    });

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

    this.firebaseAuthentication.signInWithVerificationId(this.verificationID, this.otp).then((user) => {
      console.log(user)
    });

    // this.showProgressBar = false;
    // console.log("login end", this.showProgressBar);


    setTimeout(() => {
      console.log("otp confirm sent", this.otp);
      this.showProgressBar = false;
      console.log("otp confirm end", this.showProgressBar);

      // TODO: Navigate to Home.
      this.showOTPinput = false;
      // this.router.navigate(['/home']);

    }, 3000)
  }

}
