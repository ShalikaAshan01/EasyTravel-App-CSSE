import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// move the paths of newly created pages to navigation-menu.module.ts, routes = []

const routes: Routes = [
  { path: '', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'menu', redirectTo: 'menu/home', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'menu', loadChildren: './navigation-menu/navigation-menu.module#NavigationMenuPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }