import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.page.html',
  styleUrls: ['./navigation-menu.page.scss'],
})
export class NavigationMenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Routes',
      url: '/menu/routes',
      icon: 'bus'
    },
    {
      title: 'History',
      url: '/menu/history',
      icon: 'time'
    },
    {
      title: 'Recharge',
      url: '/menu/recharge',
      icon: 'card'
    },
    {
      title: 'Settings',
      url: '/menu/settings',
      icon: 'cog'
    },
    {
      title: 'Log Out',
      url: '/login',
      icon: 'exit'
    }
  ];

  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
  }

}
