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

  createRide(record) {
    return this.fireStore.collection('rides').add(record);
  }

  getRideByID(id) {
    return this.fireStore.collection('rides').doc(id).get();
  }

  extendRide(docId, Obj) {
    return this.fireStore.collection('rides').doc(docId).update(Obj);
  }

  public getOngoingRide(uid): Observable<any[]> {
    return this.fireStore.collection<Ride>('rides', ref => ref.where('passenger', '==', uid).where('status', '==', 'ongoing')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );;
  }

  genGeoHash(_lon, _lat) {
    var longitude = _lon;
    var latitude = _lat;
    var BITS = [16, 8, 4, 2, 1];
    var BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

    var is_even = true;
    var i = 0;
    var lat = []; var lon = [];
    var bit = 0;
    var ch = 0;
    var precision = 6;
    var geohash = "";

    lat[0] = -90.0; lat[1] = 90.0;
    lon[0] = -180.0; lon[1] = 180.0;

    while (geohash.length < precision) {
      if (is_even) {
        var mid = (lon[0] + lon[1]) / 2;
        if (longitude > mid) {
          ch |= BITS[bit];
          lon[0] = mid;
        } else
          lon[1] = mid;
      } else {
        var mid = (lat[0] + lat[1]) / 2;
        if (latitude > mid) {
          ch |= BITS[bit];
          lat[0] = mid;
        } else
          lat[1] = mid;
      }

      is_even = !is_even;
      if (bit < 4)
        bit++;
      else {
        geohash += BASE32[ch];
        bit = 0;
        ch = 0;
      }
    }
    return geohash
  }
}
