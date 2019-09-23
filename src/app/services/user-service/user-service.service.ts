import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private firestore: AngularFirestore) { }


  createUser(userId, number) {
    var record = {
      accountBalance: 0,
      firstName: "",
      lastName: "",
      nic: "",
      phoneNumber: number,
      holdBalance: 0,
      status: 'inactive',
      createdDate: new Date().toISOString().slice(0, 10)
    }
    return this.firestore.collection('passengers').doc(userId).set(record).then(e => {
      console.log("Document successfully written!" + e);
    });
  }

  checkUser(userId) {
    return this.firestore.collection('passengers').doc(userId);
  }

  updateUser(userId, userObj) {
    return this.firestore.collection('passengers').doc(userId).update(userObj);
  }

  rechargeAccount(userId, user) {
    return this.firestore.collection('passengers').doc(userId).update(user)
  }

}