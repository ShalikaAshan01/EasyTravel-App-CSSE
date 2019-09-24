import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform, AlertController, ModalController } from '@ionic/angular';

import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RideService } from '../services/ride.service/ride.service'
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { ReminderPage } from '../modals/reminder/reminder.page'

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.page.html',
  styleUrls: ['./navigation-menu.page.scss'],
})
export class NavigationMenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Routes',
      url: '/menu/routes',
      icon: 'navigate'
    },
    {
      title: 'Ride History',
      url: '/menu/history',
      icon: 'time'
    },
    {
      title: 'Recharge',
      url: '/menu/recharge',
      icon: 'card'
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: 'cog'
    },
    {
      title: 'Log Out',
      url: '/login',
      icon: 'exit'
    }
  ];

  selectedPath = '';
  userAccount: any;
  accBalance: number;
  lname: any;
  fname: any;
  userId: any;
  phoneNumber: any;
  isOngoing: boolean;
  currentGeoHash: string = null;
  endGeoHash: string = null;

  constructor(private router: Router, private storage: Storage, private firestore: AngularFirestore, private alertCtrl: AlertController,
    public rideService: RideService, private localNotifications: LocalNotifications, private platform: Platform, private geolocation: Geolocation,
    public firebaseAuthentication: FirebaseAuthentication, public modalController: ModalController) {
    this.initializeApp();
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
    firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      this.userId = user.uid;
      this.firestore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(_user => {
          this.userAccount = _user;
          this.fname = this.userAccount.firstName;
          this.lname = this.userAccount.lastName;
          this.accBalance = this.userAccount.accountBalance;
          this.phoneNumber = this.userAccount.phoneNumber;
          this.storage.set('user', this.userAccount);
          // console.log(this.userAccount);
        });
      this.rideService.getOngoingRide(this.userId).subscribe(_data => {
        console.log('_data');
        var data = _data;
        if (data[0]) {
          this.isOngoing = true;
          console.log(87, this.isOngoing);
          var endLat = data[0].endPointCoordinate._lat;
          var endLong = data[0].endPointCoordinate._long;
          this.endGeoHash = this.rideService.genGeoHash(endLat, endLong);
          console.log(this.endGeoHash);
          this.matchLocation();
        } else {
          this.isOngoing = false;
          console.log(94, this.isOngoing);
        }
      });
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });

      this.localNotifications.on('trigger').subscribe(res => {
        let msg = res.data ? res.data.mydata : '';
        this.showAlert(res.title, res.text, msg);
      });
    });
  }

  matchLocation() {
    console.log(116, this.isOngoing);
    setInterval(() => {
      if (this.isOngoing) {
        this.geolocation.getCurrentPosition().then((resp) => {
          var cLatitude = resp.coords.latitude;
          var cLongitude = resp.coords.longitude;
          this.currentGeoHash = this.rideService.genGeoHash(cLatitude, cLongitude);
          console.log(resp);
          if (this.endGeoHash == this.currentGeoHash) {
            this.scheduleNotification();
            console.log(this.endGeoHash);
          }
        });
      }
    }, 20000);
    if(!this.isOngoing){
      return null;
    }

  }

  ngOnInit() {
    this.presentModal();
  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: 'Attention',
      text: 'You are arrived your location',
      data: { mydata: 'My hidden message this is' },
      trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true // Show the notification while app is open
    });
    this.isOngoing = false;
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert => alert.present());
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ReminderPage
    });
    return await modal.present();
  }

}
