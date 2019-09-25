import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { ReminderPageModule } from './modals/reminder/reminder.module'
import { RideDetailsModalPageModule } from './modals/ride-details-modal/ride-details-modal.module';
import { ActivatePageModule } from './modals/activate/activate.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'test'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    RideDetailsModalPageModule,
    ReminderPageModule,
    ActivatePageModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseAuthentication,
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
