import { Component, OnInit } from '@angular/core';
import { Ride, RideService } from '../services/ride.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  userId = 'N4t9BinxRDhBtNwFEMEI';
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
