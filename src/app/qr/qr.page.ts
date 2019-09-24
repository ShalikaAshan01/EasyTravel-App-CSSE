import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  qrData: String;
  scannedCode = null;
  elementType = 'img';

  constructor(public activatedRoute: ActivatedRoute,
    private router: Router, public navCtrl: NavController) {

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res.data);
      this.qrData = res.data;
    });
  }

  extend() {
    this.navCtrl.navigateRoot(['exted'],{
      queryParams: {data:this.qrData}
    });
  }

}
