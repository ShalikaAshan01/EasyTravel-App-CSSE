import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ride {
  startPoint: string;
  endPoint: string,
  startTime: string,
  endTime: string,
  route: string,
  tickectAmount: number,
  status: string,
  createdAt: string
}

@Injectable({
  providedIn: 'root'
})
export class RideService {

  userId = 'N4t9BinxRDhBtNwFEMEI';
  private ridesCollection: AngularFirestoreCollection<Ride>;
  private rides: Observable<Ride[]>;

  constructor(private fireStore: AngularFirestore) {

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
    );;
  }

  removeRide(rideId) {
    return this.fireStore.collection('rides').doc(rideId).delete();
  }
}
