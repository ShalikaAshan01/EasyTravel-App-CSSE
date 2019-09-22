import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { RideService } from '../services/ride.service/ride.service';
import { RideDetailsModalPage } from '../ride-details-modal/ride-details-modal.page';
import { UserServiceService } from '../services/user-service/user-service.service';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-upcoming-rides',
  templateUrl: './upcoming-rides.page.html',
  styleUrls: ['./upcoming-rides.page.scss'],
})
export class UpcomingRidesPage implements OnInit {

  user: any;
  userId: any = ' ';
  rides = null;
  status: string;

  constructor(private toastController: ToastController, private rideService: RideService, private alertController: AlertController, private modalController: ModalController, private storage: Storage, private fireStore: AngularFirestore) {

    this.storage.get('user').then((val) => {
      this.userId = val.userId;
      console.log(val.userId);
    });

  }

  ngOnInit() {

    this.fireStore.collection('passengers').doc(this.userId).valueChanges()
      .subscribe(user => {
        this.user = user;
        this.getRides(this.userId);
      });

    // this.presentToast();
  }

  async getRides(userId) {

    await this.rideService.getRides(userId).subscribe(ride => {
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
