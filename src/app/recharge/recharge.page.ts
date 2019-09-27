import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service/user-service.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

import { PaymentHistoryPage } from '../modals/payment-history/payment-history.page';
import { ActivatePage } from '../modals/activate/activate.page';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {

  user: any;
  userId: any;
  accountBalance: number = 0;

  payment: any;
  rechargeAmount: number = 0;
  cardName: string;
  cardNumber: number;
  expDate: string;
  cvv: number;

  isCardPayment: boolean = false;
  status: any;

  constructor(private userService: UserServiceService, private fireStore: AngularFirestore, private alertController: AlertController, public navCtrl: NavController,
    public firebaseAuthentication: FirebaseAuthentication, private payPal: PayPal, private modalController: ModalController) {

    this.firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      this.userId = user.uid;
      this.fireStore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(user => {
          this.user = user;
          this.accountBalance = +this.user.accountBalance;
          this.status = this.user.status;
          if (this.status == 'inactive') {
            this.presentModalActivate();
            this.navCtrl.navigateRoot(['menu/home']);
          }
        });
    });

  }

  ngOnInit() {
  }

  async viewHistory() {
    const modal = await this.modalController.create({
      component: PaymentHistoryPage,
      componentProps: {
        'userId': this.userId
      }
    });

    return await modal.present();
  }

  hasValidated() {

    if (this.rechargeAmount == null || this.cardName == null || this.cardNumber == null || this.expDate == null || this.cvv == null) {
      return false;
    }
    return true;

  }

  rechargeAccount() {
    console.log(this.hasValidated(), this.rechargeAmount, this.cardName, this.cardNumber, this.expDate, this.cvv);
    if (this.hasValidated()) {
      const header = 'Confirm Payment?';
      const message = 'Do you really want to confirm your payment?';
      this.accountBalance += this.rechargeAmount;
      console.log(this.accountBalance);
      this.showRechargeAlert(header, message);
    } else {
      this.showAlert('Error', 'Please fill all the fields')
    }

  }

  payWithPaypal() {

    if (this.rechargeAmount == 0 || this.rechargeAmount == null) {

      const header = 'Error';
      const message = 'Please enter the recharge amount!'

      this.showAlert(header, message);

    } else {

      const paymentAmount: string = this.rechargeAmount.toString();
      const currency: string = 'USD';
      this.accountBalance += this.rechargeAmount;

      console.log("Pay ????", paymentAmount);
      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'Ab5gCN585tlFErxftIU0c_HQ3WrPmFxn1i55FLBy-9cNaHiwbncPQEefOMa_we_e4Mbo2V3QfOLga3hl'
      }).then(() => {
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        })).then(() => {
          let payment = new PayPalPayment(paymentAmount, currency, 'Easy travel - Account Recharge', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((res) => {
            console.log(res);

            // Successfully paid
            this.addPayment('PayPal');
            this.updateUser(this.user);
            this.showAlert('Success', 'Your account is recharged!');

          }, () => {
            // Error or render dialog closed without being successful
            this.showAlert('Error', 'Transaction unsuccessful!');
          });
        }, () => {
          // Error in configuration
          this.showAlert('Error', 'Error in configuration!');
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
        this.showAlert('Error', 'Something went wrong! (Maybe PayPal is not supported)');
      });

    }

  }

  addPayment(method) {
    this.payment = {
      'passenger': this.userId,
      'amount': this.rechargeAmount,
      'method': method,
      'createdAt': new Date()
    }

    this.userService.addPayment(this.payment);
  }

  updateUser(user) {
    user.accountBalance = this.accountBalance;
    this.userService.rechargeAccount(this.userId, this.user).then(() => { }
    );

    this.rechargeAmount = 0;
    this.cardName = null;
    this.cardNumber = null;
    this.expDate = null;
    this.cvv = null;

    this.navCtrl.pop();
  }

  async showRechargeAlert(header, message) {
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
            this.showAlert('Alert', 'Make sure to keep your account recharged!');
          }
        }, {
          text: 'Yes',
          handler: () => {
            // IF YES
            this.addPayment('Card')
            this.updateUser(this.user);
            this.showAlert('Success', 'Your account is recharged!');
          }
        }
      ]
    });

    await alert.present();
  }

  setCardPayment() {
    this.isCardPayment = true;
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentModalActivate() {
    const modal = await this.modalController.create({
      component: ActivatePage
    });
    return await modal.present();
  }

}
