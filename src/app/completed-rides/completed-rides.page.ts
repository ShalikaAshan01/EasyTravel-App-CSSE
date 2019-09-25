import { Component, OnInit } from '@angular/core';
import { Ride, RideService } from '../services/ride.service/ride.service';
import { ModalController } from '@ionic/angular';
import { RideDetailsModalPage } from '../modals/ride-details-modal/ride-details-modal.page';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  userId: any = ' ';
  user: any;
  rides: Ride[];
  bus: any;
  regNo: any;

  constructor(private rideService: RideService, private modalController: ModalController, private storage: Storage,
    private fireStore: AngularFirestore) {

    this.storage.get('user').then((val) => {
      this.userId = val.userId;

      this.fireStore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(user => {
          this.user = user;
          this.getRides(this.userId);
        });

    });

  }

  ngOnInit() {


  }

  getRides(userId) {

    this.rideService.getRides(userId).subscribe(ride => {
      this.rides = null;
      ride.forEach(element => {
        if (element.status == 'upcoming' || element.status == 'ongoing') {
          this.rides = ride;
        }

        if (element.status == 'previous') {
          this.rideService.getBus(element.bus).subscribe(bus => {
            this.bus = bus;
            this.regNo = this.bus.regNo.toUpperCase();
          })
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

  removeRide(rideId) {
    this.rideService.removeRide(rideId);
  }

}
