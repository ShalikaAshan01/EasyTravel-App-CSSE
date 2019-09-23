import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service/user-service.service';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {

  user: any;
  userId: any;
  accountBalance: number = 0;
  rechargeAmount: number = 0;

  constructor(private userService: UserServiceService, private storage: Storage, private fireStore: AngularFirestore, private alertController: AlertController) {

    this.storage.get('user').then(val => {
      this.userId = val.userId;
      console.log(this.userId);
      this.fireStore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(user => {
          this.user = user;
          this.accountBalance = this.user.accountBalance;
          console.log(this.user);
        });
    });

  }

  ngOnInit() {

  }

  rechargeAccount() {
    const header = 'Confirm Payment?';
    const message = 'Do you really want to confirm your payment?';
    this.accountBalance += this.rechargeAmount;
    this.showRechargeAlert(this.user, header, message);
  }

  async showRechargeAlert(user, header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (exit) => {
            // IF NO
          }
        }, {
          text: 'Yes',
          handler: () => {
            // IF YES
            user.accountBalance = this.accountBalance;
            this.userService.rechargeAccount(this.userId, this.user).then(() => {
              console.log(this.rechargeAmount);
            }
            );
            this.rechargeAmount = 0;
            console.log(this.accountBalance);
          }
        }
      ]
    });

    await alert.present();
  }

}
