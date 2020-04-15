import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { PredictionsComponent } from './components/predictions/predictions.component';
import { AboutComponent } from './components/about/about.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { IcuComponent } from './components/appendix/icu/icu.component';
import { AcuComponent } from './components/appendix/acu/acu.component';
import { ScuComponent } from './components/appendix/scu/scu.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Fragment routing: https://www.geekstrick.com/fragment-url-in-angular-8/
// const routerOptions: ExtraOptions = {
//     scrollPositionRestoration: 'enabled',
//     anchorScrolling: 'enabled',
//     scrollOffset: [0, 64],
//   };

const routes: Routes = [
  {path: '', component: NavbarComponent},
  {path: 'faqs', component:FaqsComponent },
  {path: 'about', component:AboutComponent },
  {path: 'appendix/icu', component:IcuComponent },
  {path: 'appendix/acu', component:AcuComponent },
  {path: 'appendix/scu', component:ScuComponent },
  // {
  //   path: '',
  //   redirectTo: 'appendix/icu', // Empty path will redirect to content route.
  //   pathMatch: 'full'
  // }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

// @NgModule({
//   imports: [RouterModule.forRoot(routes, routerOptions)],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
