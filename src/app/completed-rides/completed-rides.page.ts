import { Component, OnInit } from '@angular/core';
import { Ride, RideService } from '../services/ride.service/ride.service';
import { ModalController } from '@ionic/angular';
import { RideDetailsModalPage } from '../ride-details-modal/ride-details-modal.page';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  userId = 'XpLThkfoeYcPTquTA2RIcoCLuO12';
  rides: Ride[];

  constructor(private rideService: RideService, private modalController: ModalController) {

  }

  ngOnInit() {
    this.getRides();
  }

  getRides() {
    this.rideService.getRides(this.userId).subscribe(ride => {
      this.rides = null;
      ride.forEach(element => {
        if (element.status == 'previous' || element.status == 'cancelled') {
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

  removeRide(rideId) {
    this.rideService.removeRide(rideId);
  }

}
