import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictionsComponent } from './components/predictions/predictions.component';
import {PredictionService} from './services/prediction.service'
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    PredictionsComponent,
    NavbarComponent,
    AboutComponent,
    FaqsComponent,
    NotificationComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [PredictionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
