import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// move the paths of newly created pages to navigation-menu.module.ts, routes = []

const routes: Routes = [
  { path: '', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'menu', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'menu', loadChildren: './navigation-menu/navigation-menu.module#NavigationMenuPageModule' },
  { path: 'test-page', loadChildren: './test-page/test-page.module#TestPagePageModule' },
  { path: 'qr', loadChildren: './qr/qr.module#QrPageModule' },
  { path: 'exted', loadChildren: './exted/exted.module#ExtedPageModule' },
  { path: 'reminder', loadChildren: './modals/reminder/reminder.module#ReminderPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }