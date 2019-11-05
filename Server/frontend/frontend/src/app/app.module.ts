import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WebSocketService } from './WebSocketService.service';
import { TestService } from './TestService.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [WebSocketService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
