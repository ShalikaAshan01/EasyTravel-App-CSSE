import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { UserServiceService } from '../../services/user-service/user-service.service';
import { RouteServiceService } from '../../services/route-service/route-service.service';
import { RideService } from '../../services/ride.service/ride.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-ride-details-modal',
  templateUrl: './ride-details-modal.page.html',
  styleUrls: ['./ride-details-modal.page.scss'],
})
export class RideDetailsModalPage implements OnInit {

  @Input() ride: any;

  state: boolean;
  user: any;
  accountBalance: any;

  // extend: any;
  userId: any = "kT9HbHVP8eXNDeubcaomjUXMOBm1";
  userAccount: any;
  start: any;
  end: any;
  route: any;
  sPointId: any;
  ePointId: any;
  amount: any;
  points: { _id: string; isEdit: boolean; id: any; name: any; location: any; }[];
  ePoints: any[];
  exd: any;
  extendAmount: number;
  bal: string;
  totalAmount: any;
  docID: any;
  disableDrop: any = 'false';


  constructor(private modalController: ModalController, private navParams: NavParams, private userService: UserServiceService,
    public firebaseAuthentication: FirebaseAuthentication, private firestore: AngularFirestore, public navCtrl: NavController, public rideService: RideService,
    public routeService: RouteServiceService) {
  }

  ngOnInit() {
    this.ride = this.navParams.get('ride');
    this.docID = this.navParams.get('docId');

    // this.firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
    //   this.userId = user.uid;
    this.firestore.collection('passengers').doc(this.userId).valueChanges()
      .subscribe(_user => {
        this.userAccount = _user;
        this.accountBalance = this.userAccount.accountBalance;
      });
    // });
    this.start = this.ride.startPoint;
    this.end = this.ride.endPoint;
    this.route = this.ride.route;
    this.sPointId = this.ride.startPointId;
    this.ePointId = this.ride.endPointId;
    this.amount = this.ride.ticketAmount;

    this.routeService.getRoutePoints(this.route).subscribe(data => {
      this.points = data.map(e => {
        return {
          _id: e.payload.doc.id,
          isEdit: false,
          id: e.payload.doc.data()['id'],
          name: e.payload.doc.data()['name'],
          location: e.payload.doc.data()['location'],
        };
      });
      console.log(this.points);
      if (this.sPointId < this.ePointId) {
        var temp = [];
        this.points.forEach(element => {
          if (this.ePointId <= element.id) {
            temp.push(element);
          }
        })
        this.ePoints = temp;
      }
      if (this.sPointId > this.ePointId) {
        var temp = [];
        this.points.forEach(element => {
          if (this.ePointId >= element.id) {
            temp.push(element);
          }
        })
        this.ePoints = temp;
      }
    });

    if (this.ride.status == 'previous' || this.ride.status == 'cancelled' || this.ride.state == 'upcoming') {
      this.state = false;
    }
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  pointSelect($event) {
    if (this.ePointId < this.exd) {
      this.extendAmount = (this.exd - this.ePointId) * 8;
      if (this.extendAmount > this.accountBalance) {
        this.bal = 'insufficent';
      } else {
        this.bal = '';
      }
    }
    if (this.ePointId > this.exd) {
      this.extendAmount = (this.ePointId - this.exd) * 8;
      if (this.extendAmount > this.accountBalance) {
        this.bal = 'insufficent';
      } else {
        this.bal = '';
      }
    }
    this.totalAmount = this.amount + this.extendAmount;
  }

  extend() {
    var endData;
    this.ePoints.forEach(element => {
      if (element.id == this.exd) {
        endData = {
          endPoint: element.name,
          endPointCoordinate: element.location,
        }
      }
    });
    var ride = {
      endPoint: endData.endPoint,
      endPointId: this.exd,
      endPointCoordinate: endData.endPointCoordinate,
      ticketAmount: this.totalAmount
    }
    this.accountBalance = this.accountBalance - this.extendAmount;
    this.rideService.extendRide(this.docID, ride).then(resp => {
      console.log("Extended successfully" + resp);
      var data = {
        accountBalance: this.accountBalance,
      }
      this.userService.updateUser(this.userId, data).then(resp => {
        console.log("Updated successfull!!" + resp);
        this.dismissModal();
      });
    })
  }

  recharge(){
    this.navCtrl.navigateForward(['recharge']);
  }

}
