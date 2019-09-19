import { Component, OnInit } from '@angular/core';
import { Ride, RideService } from '../services/ride.service/ride.service';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  userId = 'XpLThkfoeYcPTquTA2RIcoCLuO12';
  rides: Ride[];

  constructor(private rideService: RideService) {

  }

  ngOnInit() {
    this.getRides();
  }

  getRides() {
    this.rideService.getRides(this.userId).subscribe(ride => {
      this.rides = ride;
      console.log(this.rides);
    });
  }

  removeRide(rideId) {
    this.rideService.removeRide(rideId);
  }

}
