import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredectionsComponent } from './predections/predections.component';
import { AboutComponent } from './about/about.component';
import { FaqsComponent } from './faqs/faqs.component';
import { NavbarComponent } from './navbar/navbar.component';
const routes: Routes = [
  {path: '', component: NavbarComponent},
  {path: 'faqs', component:FaqsComponent },
  {path: 'about', component:AboutComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
