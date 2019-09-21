import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { RideService } from '../services/ride.service/ride.service';
import { RideDetailsModalPage } from '../ride-details-modal/ride-details-modal.page';

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
    private alertController: AlertController,
    private modalController: ModalController) {

  }

  ngOnInit() {
    this.getRides();
    // this.presentToast();
  }

  getRides() {
    this.rideService.getRides(this.userId).subscribe(ride => {
      this.rides = null;
      ride.forEach(element => {
        if (element.status == 'upcoming' || element.status == 'ongoing') {
          this.rides = ride;
        }
      });
    });
  }

  async viewRide(ride) {
    const modal = await this.modalController.create({
      component: RideDetailsModalPage,
      componentProps: {
        'ride': ride
      }
    });
    return await modal.present();
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

          }
        }, {
          text: 'Yes',
          handler: () => {
            ride.status = 'cancelled';
            this.rideService.cancelRide(ride).then(() => {

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
