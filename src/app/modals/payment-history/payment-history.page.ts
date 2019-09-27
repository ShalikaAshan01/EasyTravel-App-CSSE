import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserServiceService } from 'src/app/services/user-service/user-service.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {

  @Input() userId: any;
  payments: any;

  constructor(private modalController: ModalController, private userService: UserServiceService) { }

  ngOnInit() {
    console.log(this.userId);
    this.getPayments()
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  getPayments() {
    console.log(this.userId);
    this.userService.getPayments(this.userId).subscribe(payments => {
      this.payments = payments;
    });
  }

}
