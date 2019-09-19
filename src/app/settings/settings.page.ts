import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  phoneNumber: any;
  accountBalance: any;
  firstname: any;
  lastname: any;
  nic: any;
  userAccount: any;
  userId: any;

  constructor(private userService: UserServiceService,
    private storage: Storage,
    private firestore: AngularFirestore,
    private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      this.userId = val.userId;
      this.firestore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(_user => {
          this.userAccount = _user;
          this.firstname = this.userAccount.firstName;
          this.lastname = this.userAccount.lastName;
          this.nic = this.userAccount.nic;
          this.phoneNumber = this.userAccount.phoneNumber;
          this.accountBalance = this.userAccount.accountBalance;
        });
    });
  }

  updateUser() {
    var data = {
      firstName: this.firstname,
      lastName: this.lastname,
      nic: this.nic
    }
    this.userService.updateUser(this.userId, data).then(resp => {
      this.firestore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(_user => {
          this.userAccount = _user;
          var userAcc = {
            userId: this.userId,
            firstName: this.userAccount.firstName,
            lastName: this.userAccount.lastName,
            accountBalance: this.userAccount.accountBalance,
            nic: this.userAccount.nic,
            phoneNumber: this.userAccount.phoneNumber,
            holdBalance: this.userAccount.holdBalance,
            status: this.userAccount.status
          }
          this.storage.set('user', userAcc);
          this.presentAlertConfirm();
        });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Account updated successfully..!',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigate(['menu/home']);
          }
        }
      ]
    });

    await alert.present();
  }

}
