import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RideService } from '../services/ride.service/ride.service';
import { RouteServiceService } from '../services/route-service/route-service.service';
import { UserServiceService } from '../services/user-service/user-service.service';

@Component({
  selector: 'app-exted',
  templateUrl: './exted.page.html',
  styleUrls: ['./exted.page.scss'],
})
export class ExtedPage implements OnInit {

  docID: any;
  ride: any;
  extendAmount: any = 0;
  totalAmount: any = 0;
  route: any;
  accountBalance: any = 0;
  routes: any;
  points: any;
  sPointId: any;
  ePointId: any;
  ePoints: any;
  amount: any;
  start: any = 0;
  end: any = 0;
  exd: any = 0;
  bal: String;
  userId: String;
  disableDrop: any = 'false';

  constructor(public activatedRoute: ActivatedRoute,
    private router: Router, public navCtrl: NavController, public rideService: RideService,
    private storage: Storage, public routeService: RouteServiceService, private userService: UserServiceService) { }

  ngOnInit() {
    this.storage.get('user').then((val) => {
       this.accountBalance = val.accountBalance;
      this.userId = val.userId;
      console.log(this.accountBalance);
    });
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res.data);
      this.docID = res.data;
      this.rideService.getRideByID(this.docID).subscribe(data => {
        console.log(data.data());
        this.ride = data.data();
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
      });
    });
  }

  pointSelect($event) {
    if(this.ePointId < this.exd){
      this.extendAmount = (this.exd - this.ePointId) * 8;
      if (this.extendAmount > this.accountBalance) {
        this.bal = 'insufficent';
      } else {
        this.bal = '';
      }
    }
    if(this.ePointId > this.exd){
      this.extendAmount = (this.ePointId - this.exd) * 8;
      if (this.extendAmount > this.accountBalance) {
        this.bal = 'insufficent';
      } else {
        this.bal = '';
      }
    }
  }

  extend(){
    this.totalAmount = this.amount + this.extendAmount;
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
    this.rideService.extendRide(this.docID, ride).then(resp=>{
      console.log("Extended successfully"+resp);
      var data = {
        accountBalance: this.accountBalance,
      }
      this.userService.updateUser(this.userId, data).then(resp => {
        console.log("Updated successfull!!" + resp);
        this.navCtrl.navigateRoot(['qr'], {
          queryParams: { data: this.docID }
        });
      });
    })
  }

}
