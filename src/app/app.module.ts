import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { MaterialComponent } from './material/material.component';
import { NgxEchartsModule} from 'ngx-echarts';
import 'echarts-gl';

@NgModule({
  declarations: [
    AppComponent,
    MaterialComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FileUploadModule,
    AppRoutingModule,
    NgxEchartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
