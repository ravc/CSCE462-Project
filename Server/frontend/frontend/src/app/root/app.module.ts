import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WebSocketService } from '../SocketServices/WebSocketService.service';
import { ChartService } from '../SocketServices/ChartService.service';
import { PlantService } from '../SocketServices/PlantService.service';

import { HomeComponent } from '../home/home.component';
import { ChartComponent } from '../charts/charts.component';
import { PlantComponent } from '../plants/plants.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';

import { HighchartsChartComponent } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartComponent,
    PlantComponent,
    HighchartsChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [WebSocketService, ChartService, PlantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
