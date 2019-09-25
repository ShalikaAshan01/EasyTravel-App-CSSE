import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.page.html',
  styleUrls: ['./reminder.page.scss'],
})
export class ReminderPage implements OnInit {
  docID: any;

  constructor(public modalController: ModalController, public navCtrl: NavController, private navParams: NavParams) { }

  ngOnInit() {
    this.docID = this.navParams.get('qrID');
  }
  dismiss() {
    this.navCtrl.navigateForward(['qr'], {
      queryParams: {
        data: this.docID,
        status: false
      }
    });
    this.modalController.dismiss({
      'dismissed': true
    });
  }



}
