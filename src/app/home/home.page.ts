import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit{
  latitude: any;
  longitude: any;
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
    console.log("ddd");
  }

  ngAfterViewInit(): void {
    console.log("ddd");
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(resp);
      const map = new google.maps.Map(this.mapNativeElement.nativeElement, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 16
      });
      /*location object*/
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
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
