import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RideDetailsModalPage } from './ride-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RideDetailsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RideDetailsModalPage]
})
export class RideDetailsModalPageModule { }
