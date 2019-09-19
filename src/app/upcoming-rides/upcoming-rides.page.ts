import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { RideService } from '../services/ride.service/ride.service';

@Component({
  selector: 'app-upcoming-rides',
  templateUrl: './upcoming-rides.page.html',
  styleUrls: ['./upcoming-rides.page.scss'],
})
export class UpcomingRidesPage implements OnInit {

  userId = 'XpLThkfoeYcPTquTA2RIcoCLuO12';
  rides = null;
  status: string;

  constructor(
    private toastController: ToastController,
    private rideService: RideService,
    private alertController: AlertController) {

  }

  ngOnInit() {
    this.getRides();
    // this.presentToast();
  }

  getRides() {
    this.rideService.getRides(this.userId).subscribe(ride => {
      this.rides = ride;
      console.log(this.rides);
    });
  }

  viewRide() {

  }

  async cancelRide(ride) {
    const header = 'Cancel ride';
    const message = 'Do you really want to cancel the ride?';
    this.showCancelAlert(ride, header, message)
  }

  async showCancelAlert(ride, header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (exit) => {
            console.log('Confirm Cancel:', exit);
          }
        }, {
          text: 'Yes',
          handler: () => {
            ride.status = 'cancelled';
            console.log(ride);
            this.rideService.cancelRide(ride).then(() => {
              console.log('cancelled', ride);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast() {

    const toast = await this.toastController.create({
      message: 'Slide Left to edit ride details',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}
