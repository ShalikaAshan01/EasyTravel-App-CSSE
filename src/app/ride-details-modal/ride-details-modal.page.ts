import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-ride-details-modal',
  templateUrl: './ride-details-modal.page.html',
  styleUrls: ['./ride-details-modal.page.scss'],
})
export class RideDetailsModalPage implements OnInit {

  @Input() ride: any;

  state: boolean;
  accountBalance: any;

  constructor(private modalController: ModalController, private navParams: NavParams, private storage: Storage) {
    this.ride = navParams.get('ride');

    this.storage.get('user').then((val) => {
      this.accountBalance = val.accountBalance;
      console.log(val)
    });

  }

  ngOnInit() {

    if (this.ride.status == 'previous' || this.ride.status == 'cancelled' || this.ride.state == 'upcoming') {
      this.state = false;
    }
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
