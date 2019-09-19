import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming-rides',
  templateUrl: './upcoming-rides.page.html',
  styleUrls: ['./upcoming-rides.page.scss'],
})
export class UpcomingRidesPage implements OnInit {

  rides = null;

  constructor(private toastController: ToastController) {

    this.rides = [
      {
        id: '4L2aSRHiF3wqryU0DTOB',
        startPoint: 'Kaduwela',
        endPoint: 'Kollupitiya',
        startTime: 'September 18, 2019 at 8:36:01 PM UTC+5:30',
        ticketAmount: 42.00,
        status: 'completed',
        bus: {
          route: '177'
        }
      },
      {
        id: '4L2aSRHiF3wqryU0DTOB',
        startPoint: 'Malabe',
        endPoint: 'Maharagama',
        startTime: 'September 19, 2019 at 5:12:58 PM UTC+5:30',
        ticketAmount: 36.00,
        status: 'not_started',
        bus: {
          route: '993'
        }
      }
    ];

  }

  ngOnInit() {
    console.log(this.rides.length)
    if (this.rides.length == 0) {
      this.presentToast();
    }
  }

  viewRide() {

  }

  async presentToast() {

    const toast = await this.toastController.create({
      message: 'Slide Left to edit ride details',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}
