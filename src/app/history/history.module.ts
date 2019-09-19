import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage,
    children: [
      { path: '', redirectTo: 'upcoming-rides' },
      { path: 'upcoming-rides', loadChildren: '../upcoming-rides/upcoming-rides.module#UpcomingRidesPageModule' },
      { path: 'completed-rides', loadChildren: '../completed-rides/completed-rides.module#CompletedRidesPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule { }
