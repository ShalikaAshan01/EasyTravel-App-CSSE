import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { RideService } from '../services/ride.service/ride.service';
import { UserServiceService } from '../services/user-service/user-service.service';

@Component({
  selector: 'app-upcoming-rides',
  templateUrl: './upcoming-rides.page.html',
  styleUrls: ['./upcoming-rides.page.scss'],
})
export class UpcomingRidesPage implements OnInit {

  userId = 'N4t9BinxRDhBtNwFEMEI';
  rides = null;

  constructor(private toastController: ToastController, private rideService: RideService) {

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

  async presentToast() {

    const toast = await this.toastController.create({
      message: 'Slide Left to edit ride details',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}
