import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RouteServiceService } from '../services/route-service/route-service.service';
import { RideService } from '../services/ride.service/ride.service'
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserServiceService } from '../services/user-service/user-service.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.page.html',
  styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage implements OnInit {
  qrData: String;
  scannedCode = null;
  elementType = 'img';
  status: String;

  route: any;
  accountBalance: any = 0;
  routes: any;
  points: any;
  sPoints: any;
  ePoints: any;
  amount: any;
  start: any = 0;
  end: any = 0;
  bal: String;
  userId: String;

  constructor(private storage: Storage, public routeService: RouteServiceService, public rideService: RideService,
    private router: Router, public navCtrl: NavController, private userService: UserServiceService) {

  }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      this.accountBalance = val.accountBalance;
      this.userId = val.userId;
      console.log(this.accountBalance);
    });
    this.routeService.getRoutes().subscribe(data => {
      this.routes = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          routeNo: e.payload.doc.data()['routeNo'],
        };
      })
      console.log(this.routes);
    });
  }

  routeSelect(event) {
    console.log(this.route);
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
      this.sPoints = this.points;
      this.ePoints = this.points;
      console.log(this.points);
    });
  }

  pointSelect($event) {
    console.log(this.start);
    console.log(this.end);

    if ((this.end != 0) || (this.start != 0 && this.end != 0)) {
      if (this.start < this.end) {
        this.amount = (this.end - this.start) * 8;
      } else {
        this.amount = (this.start - this.end) * 8;
      }
    }
    if (this.amount > this.accountBalance) {
      this.bal = 'insufficent';
    } else {
      this.bal = '';
    }
  }

  bookNow() {
    var startData;
    var endData;
    this.accountBalance = this.accountBalance - this.amount;
    if (this.start != 0 || this.end != 0) {
      this.points.forEach(element => {
        if (element.id == this.start) {
          startData = {
            startPoint: element.name,
            startPointCoordinate: element.location,
          }
        }
        if (element.id == this.end) {
          endData = {
            endPoint: element.name,
            endPointCoordinate: element.location,
          }
        }
      });
      var ride = {
        createdAt: new Date().toISOString().slice(0, 19),
        endPoint: endData.endPoint,
        endPointId: this.end,
        endPointCoordinate: endData.endPointCoordinate,
        startPoint: startData.startPoint,
        startPointId: this.start,
        startPointCoordinate: startData.startPointCoordinate,
        passenger: this.userId,
        route: this.route,
        status: 'upcoming',
        ticketAmount: this.amount
      }

      this.rideService.createRide(ride).then(resp => {
        console.log(resp.id);
        this.status = 'created';
        this.qrData = resp.id;
        this.navCtrl.navigateRoot(['qr'], {
          queryParams: { data: this.qrData }
        });
        var data = {
          accountBalance: this.accountBalance,
        }
        this.userService.updateUser(this.userId, data).then(resp => {
          console.log("Updated successfull!!" + resp);
        });
      })
        .catch(error => {
          console.log(error);
        });
    }

  }

}
