import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BlogService } from './blog.service';
import { Router } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [AppComponent, ListComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [BlogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
