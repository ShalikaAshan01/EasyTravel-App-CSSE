import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { RideDetailsModalPage } from '../modals/ride-details-modal/ride-details-modal.page';
import { RideService } from '../services/ride.service/ride.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  qrData: string;
  scannedCode = null;
  elementType = 'img';
  ride: any;
  status: any = "false";
  preStatus: boolean = false;

  constructor(public activatedRoute: ActivatedRoute, public rideService: RideService, private firestore: AngularFirestore,
    private router: Router, public navCtrl: NavController, private modalController: ModalController, public alertController: AlertController) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res.data);
      this.qrData = res.data;
      this.status = res.status;
      console.log(res);
      if (this.status) {
        this.firestore.collection('rides').doc(this.qrData).valueChanges()
          .subscribe(data => {
            console.log(data);
            this.ride = data;
            console.log('status', this.ride.status);
            if (this.ride.status == 'previous') {
              if (!this.preStatus) {
                console.log('1this.presentAlertConfirm();');
                this.presentAlertConfirm();
                this.preStatus = true;
                console.log('2this.presentAlertConfirm();');
              }
            }
          });
      }
    });
  }

  extend() {
    this.viewRide(this.ride);
  }

  async viewRide(ride) {
    const modal = await this.modalController.create({
      component: RideDetailsModalPage,
      componentProps: {
        'ride': ride,
        'docId': this.qrData
      }
    });
    return await modal.present();
  }

  async presentAlertConfirm() {
    if (!this.preStatus) {
      this.preStatus = true;
      const alert = await this.alertController.create({
        header: 'Success!',
        message: 'Thank you for ride with us..!',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.navCtrl.navigateRoot(['menu/home']);
            }
          }
        ]
      });
      await alert.present();
    }
  }
}
