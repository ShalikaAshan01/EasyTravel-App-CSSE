import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  rides = null;

  constructor() {

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
  }

}
