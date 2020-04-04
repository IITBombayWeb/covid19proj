import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PredectionsComponent } from './predections/predections.component';
import { AboutComponent } from './about/about.component';
import { FaqsComponent } from './faqs/faqs.component';
const routes: Routes = [
  {path: '', component: PredectionsComponent},
  {path: 'faqs', component:FaqsComponent },
  {path: 'about', component:AboutComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
