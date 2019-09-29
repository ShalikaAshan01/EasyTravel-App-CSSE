import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { RouteServiceService } from '../services/route-service/route-service.service';
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
  stops: any = [];
  markers: any = [];
  map: any;

  constructor(private geolocation: Geolocation, private firestore: AngularFirestore, public firebaseAuthentication: FirebaseAuthentication,
    public modalController: ModalController, public navCtrl: NavController, public routeService: RouteServiceService) {

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
      this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 16
      });

      const pos = {
        lat: this.latitude,
        lng: this.longitude
      };
      this.map.setCenter(pos);
      const icon = {
        url: 'assets/icon/user.png', // image url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      };
      const marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'Hello World!',
        icon: icon
      });
      this.routeService.getStops().subscribe(data => {
        this.stops = data.map(e => {
          return {
            id: e.payload.doc.id,
            isEdit: false,
            stop: e.payload.doc.data()['stop'],
          };
        })
        this.stops.forEach(element => {
          this.addMarker(element.stop._lat, element.stop._long);
        });
        this.loaded = false;
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  addMarker(lat: any, long: any): void {
    const icon = {
      url: 'assets/icon/stop.png', // image url
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    const pos = {
      lat: lat,
      lng: long
    };
    let marker = new google.maps.Marker({
      icon: icon,
      map: this.map,
      position: pos,
      title: 'stops'
    });
    this.markers.push(marker);

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
