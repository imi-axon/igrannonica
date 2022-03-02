import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UplataComponent } from './uplata/uplata.component';
import { UplataFormComponent } from './uplata/uplata-form/uplata-form.component';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule } from 'ngx-toastr';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    UplataComponent,
    UplataFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
