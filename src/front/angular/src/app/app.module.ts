import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//routingComponents - niz putanja koji pravimo u app-routing.module.ts i onda ne mora da se importuje na sledeci nacin
//import { komponenta } from './komponentaFolder/komponenta.component'; vec se samo u @NgModule doda routingComponents
//Svaki put kada se doda nova putanja, spakovati je u routingComponents niz i ona ce se naci i u @NgModule unutar routingComponents
import { AppRoutingModule , routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CsvServiceService } from './services/csv-service.service';
import { NavbarComponent } from './_components/_elements/navbar/navbar.component';
import { SidebarComponent } from './_components/_elements/sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents, //ovde se nalaze sve putanje dodate u routingComponents niz u app-routing.module.ts
    NavbarComponent, 
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CsvServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
