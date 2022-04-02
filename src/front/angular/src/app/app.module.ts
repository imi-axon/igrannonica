import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//routingComponents - niz putanja koji pravimo u app-routing.module.ts i onda ne mora da se importuje na sledeci nacin
//import { komponenta } from './komponentaFolder/komponenta.component'; vec se samo u @NgModule doda routingComponents
//Svaki put kada se doda nova putanja, spakovati je u routingComponents niz i ona ce se naci i u @NgModule unutar routingComponents
import { AppRoutingModule , routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './_components/_elements/navbar/navbar.component';
import { SidebarComponent } from './_components/_elements/sidebar/sidebar.component';
import { DataSetPageComponent } from './_components/_pages/data-set-page/data-set-page.component';
import { DataSetTableComponent } from './_components/_elements/data-set-table/data-set-table.component';
import { observable } from 'rxjs';
import { RegistrationFormComponent } from './_components/_elements/registration-form/registration-form.component';
import { RegistrationPageComponent } from './_components/_pages/registration-page/registration-page.component';
import { CsvComponent } from './_components/_elements/csv/csv.component';
import { FormsModule } from '@angular/forms';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';
import { LoginFormComponent } from './_components/_elements/login-form/login-form.component';
import { NewProjectComponent } from './_components/_elements/new-project/new-project.component';
import { StatisticsPageComponent } from './_components/_pages/statistics-page/statistics-page.component';
import { DatasetService } from './_utilities/_services/dataset.service';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { HomeComponent } from './_components/_elements/home/home.component';
import { LoaderComponent } from './_components/_elements/loader/loader.component';
import { ListaProjekataComponent } from './_components/_elements/lista-projekata/lista-projekata.component';
import { CorrelationTableComponent } from './_components/_elements/correlation-table/correlation-table.component';
import { ProfilComponent } from './_components/_elements/profil/profil.component';
import { OpcijeDatasetComponent } from './_components/_elements/opcije-dataset/opcije-dataset.component';
import { OpcijeEditDatasetComponent } from './_components/_elements/opcije-edit-dataset/opcije-edit-dataset.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import {MatSelectModule} from '@angular/material/select';
import { NavbarNoviComponent } from './_components/_elements/navbar-novi/navbar-novi.component';
import { VerificationComponent } from './_components/_pages/verification/verification.component';
import { EditDatasetComponent } from './_components/_elements/edit-dataset/edit-dataset.component';
import { DatasetOptionsComponent } from './_components/_elements/dataset-options/dataset-options.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents, //ovde se nalaze sve putanje dodate u routingComponents niz u app-routing.module.ts
    CsvComponent,
    NavbarComponent, 
    SidebarComponent,
    DataSetTableComponent,
    LoginFormComponent,
    RegistrationFormComponent, 
    RegistrationSuccessfulComponent,
    LoginFormComponent,
    NewProjectComponent,
    StatisticsPageComponent,
    HomeComponent,
    LoaderComponent,
    ListaProjekataComponent,
    CorrelationTableComponent,
    ProfilComponent,
    OpcijeDatasetComponent,
    OpcijeEditDatasetComponent,
    NavbarNoviComponent,
    VerificationComponent,
    EditDatasetComponent,
    DatasetOptionsComponent
  ],
  imports: [
    NgxCsvParserModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    MatTooltipModule,
    MatSelectModule
  ],
  providers: [DatasetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
