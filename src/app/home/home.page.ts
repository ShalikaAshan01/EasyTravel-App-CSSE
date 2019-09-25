import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ModalController, NavController } from '@ionic/angular';

import { ActivatePage } from '../modals/activate/activate.page'

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  latitude: any;
  longitude: any;
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  userAccount: any;
  status: any;
  userId: string;
  loaded: boolean = true;

  constructor(private geolocation: Geolocation, private firestore: AngularFirestore, public firebaseAuthentication: FirebaseAuthentication,
    public modalController: ModalController, public navCtrl: NavController) {

  }

  ngOnInit() {
    this.firebaseAuthentication.onAuthStateChanged().subscribe((user) => {
      this.userId = user.uid;
      this.firestore.collection('passengers').doc(this.userId).valueChanges()
        .subscribe(_user => {
          this.userAccount = _user;
          this.status = this.userAccount.status;
        });
    });
  }

  ngAfterViewInit(): void {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(resp);
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 16
      });
      
      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      map.setCenter(pos);
      const icon = {
        url: 'assets/icon/user.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Hello World!',
        icon: icon
      });
      this.loaded = false;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  bookRide() {
    if (this.status == 'active') {
      this.navCtrl.navigateForward(['/menu/book-ride']);
    }
    if (this.status == 'inactive') {
      this.presentModal();
    }

  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ActivatePage,
    });
    return await modal.present();
  }
}
