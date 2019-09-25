import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { RideDetailsModalPage } from '../modals/ride-details-modal/ride-details-modal.page';
import { RideService } from '../services/ride.service/ride.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  qrData: String;
  scannedCode = null;
  elementType = 'img';
  ride: any;
  status: boolean = false;

  constructor(public activatedRoute: ActivatedRoute, public rideService: RideService,
    private router: Router, public navCtrl: NavController, private modalController: ModalController) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res.data);
      this.qrData = res.data;
      this.status = res.status;
      if(this.status){
        this.rideService.getRideByID(this.qrData).subscribe(data => {
          console.log(data.data());
          this.ride = data.data();
        });
      }
    });
  }

  extend() {
    this.viewRide(this.ride);
  }

  async viewRide(ride) {
    const modal = await this.modalController.create({
      component: RideDetailsModalPage,
      componentProps: {
        'ride': ride,
        'docId': this.qrData
      }
    });
    return await modal.present();
  }
}
