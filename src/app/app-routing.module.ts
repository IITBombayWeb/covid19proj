import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredectionsComponent } from './components/predections/predections.component';
import { AboutComponent } from './components/about/about.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { NavbarComponent } from './components/navbar/navbar.component';
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
