import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NgSidesheetModule } from 'ng-sidesheet';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgSidesheetModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
