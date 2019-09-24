import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface Ride {
  startPoint: string;
  endPoint: string,
  startTime: string,
  endTime: string,
  bus: string,
  route: string,
  tickectAmount: number,
  status: string,
  createdAt: string
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private fireStore: AngularFirestore) { }

  getRide(rideId) {
    return this.fireStore.collection('rides').doc<Ride>(rideId).valueChanges();
  }

  getRides(userId) {
    return this.fireStore.collection<Ride>('rides', ref => ref.where('passenger', '==', userId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getBus(busId) {
    return this.fireStore.collection('buses').doc(busId).valueChanges();
  }

  cancelRide(ride) {
    return this.fireStore.collection('rides').doc(ride.id).update(ride);
  }

  removeRide(rideId) {
    return this.fireStore.collection('rides').doc(rideId).delete();
  }
}
