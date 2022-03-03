import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormaComponent } from './delovi/forma/forma.component';
import { DugmeComponent } from './delovi/dugme/dugme.component';
import { ListaComponent } from './delovi/lista/lista.component';
import { ZadaciComponent } from './delovi/zadaci/zadaci.component';

@NgModule({
  declarations: [
    AppComponent,
    FormaComponent,
    DugmeComponent,
    ListaComponent,
    ZadaciComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
