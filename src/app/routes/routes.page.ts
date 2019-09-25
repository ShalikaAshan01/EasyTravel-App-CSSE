import { Component, OnInit } from '@angular/core';
import { RouteServiceService } from '../services/route-service/route-service.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {

  routes: any = [];

  constructor(public routeService: RouteServiceService) {
  }

  ngOnInit() {
    this.routeService.getRoutes().subscribe(data => {
      this.routes = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          routeNo: e.payload.doc.data()['routeNo'],
          start: e.payload.doc.data()['start'],
          end: e.payload.doc.data()['end'],
        };
      });
      console.log(this.routes);
    });
  }

}
