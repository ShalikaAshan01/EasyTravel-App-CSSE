import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserServiceService } from '../services/user-service/user-service.service';

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

  constructor(private modalController: ModalController, private navParams: NavParams, private storage: Storage, private userService: UserServiceService) {
    this.ride = navParams.get('ride');

    storage.get('user').then((val) => {

      userService.checkUser(val.userId).valueChanges().subscribe(user => {
        this.user = user;
        this.accountBalance = this.user.accountBalance;
      });

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
