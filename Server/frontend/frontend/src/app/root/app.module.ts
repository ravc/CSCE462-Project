import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WebSocketService } from '../SocketServices/WebSocketService.service';
import { TestService } from '../SocketServices/TestService.service';

import { HomeComponent } from '../home/home.component';
import { ChartComponent } from '../charts/charts.component';
import { PlantComponent } from '../plants/plants.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartComponent,
    PlantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [WebSocketService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
