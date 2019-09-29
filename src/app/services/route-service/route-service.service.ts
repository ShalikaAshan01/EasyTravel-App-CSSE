import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RouteServiceService {

  constructor(private firestore: AngularFirestore) { }
''
  getRoutes() {
    return this.firestore.collection('routes').snapshotChanges();
  }

  getRoutePoints(docId) {
    return this.firestore.collection('routes').doc(docId).collection('points').snapshotChanges();
  }

  getStops(){
    return this.firestore.collection('stops').snapshotChanges();
  }
}
