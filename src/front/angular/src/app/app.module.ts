import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//routingComponents - niz putanja koji pravimo u app-routing.module.ts i onda ne mora da se importuje na sledeci nacin
//import { komponenta } from './komponentaFolder/komponenta.component'; vec se samo u @NgModule doda routingComponents
//Svaki put kada se doda nova putanja, spakovati je u routingComponents niz i ona ce se naci i u @NgModule unutar routingComponents
import { AppRoutingModule , routingComponents} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './_components/_elements/navbar/navbar.component';
import { SidebarComponent } from './_components/_elements/sidebar/sidebar.component';
import { RegistrationFormComponent } from './_components/_elements/registration-form/registration-form.component';
import { FileInputComponent } from './_components/_elements/file-input/file-input.component';
import { FormsModule } from '@angular/forms';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';
import { LoginFormComponent } from './_components/_elements/login-form/login-form.component';
import { NewProjectComponent } from './_components/_elements/new-project/new-project.component';
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import { NavbarNoviComponent } from './_components/_elements/navbar-novi/navbar-novi.component';
import { VerificationComponent } from './_components/_pages/verification-page/verification.component';
import { EditDatasetComponent } from './_components/_elements/edit-dataset/edit-dataset.component';

import { ChangepassFormComponent } from './_components/_elements/changepass-form/changepass-form.component';
import { ChangepassPageComponent } from './_components/_pages/changepass-page/changepass-page.component';
import { InputusernameFormComponent } from './_components/_elements/inputusername-form/inputusername-form.component';
import { InputusernamePageComponent } from './_components/_pages/inputusername-page/inputusername-page.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateNeuralNetworkComponent } from './_components/_elements/create-neural-network/create-neural-network.component';
import { DatasetOptionsComponent } from './_components/_elements/dataset-options/dataset-options.component';
import { ProjectPageStatisticsEditComponent } from './_components/_pages/project-page-statistics-edit/project-page-statistics-edit.component';
// import { StatisticsPageNewComponent } from './_components/_pages/statistics-page-new/statistics-page-new.component';
import { NeuralNetworkDisplayComponent } from './_components/_elements/neural-network-display/neural-network-display.component';
import { LandingNavComponent } from './_components/_elements/landing-nav/landing-nav.component';
import { EditProfilePageComponent } from './_components/_pages/edit-profile-page/edit-profile-page.component';
import { EditProfileFormComponent } from './_components/_elements/edit-profile-form/edit-profile-form.component';
import { StatisticsComponent } from './_components/_elements/statistics/statistics.component';
import { DataSetTableComponent } from './_components/_elements/data-set-table/data-set-table.component';
import { KonfiguracijaComponent } from './_components/_elements/konfiguracija/konfiguracija.component';
import { TrainingPageComponent } from './_components/_pages/training-page/training-page.component';

import { LandingPageSelectorComponent } from './_components/_elements/landing-page-selector/landing-page-selector.component';
import { NetworkListComponent } from './_components/_elements/network-list/network-list.component';
import { ChartTrainingComponent } from './_components/_elements/chart-training/chart-training.component';
import { NgChartsModule } from 'ng2-charts';
import { PhotoInputComponent } from './_components/_elements/photo-input/photo-input.component';
import { NnPageComponent } from './_components/_pages/nn-page/nn-page.component';
import { ProjectListComponent } from './_components/_elements/project-list/project-list.component';
import { ListControlsComponent } from './_components/_elements/list-controls/list-controls.component';
import { FullscreenLoaderComponent } from './_components/_elements/fullscreen-loader/fullscreen-loader.component';
import { PublicExpPageComponent } from './_components/_pages/public-exp-page/public-exp-page.component';
import { TelNavComponent } from './_components/_elements/tel-nav/tel-nav.component';
import { LanguageComponent } from './_components/_elements/language/language.component';
import { ThreeBackgroundCanvasComponent } from './_components/_elements/three-background-canvas/three-background-canvas.component';
import { PageControlsComponent } from './_components/_elements/page-controls/page-controls.component';
import { PopupWindowComponent } from './_components/_elements/popup-window/popup-window.component';
import { MatDialogModule} from '@angular/material/dialog';
import { StatisticsTableComponent } from './_components/_elements/statistics-table/statistics-table.component';
import { FallingStarParticleComponent } from './_components/_elements/falling-star-particle/falling-star-particle.component';
import { ThemeComponent } from './_components/_elements/theme/theme.component';
import { ExperimentAllNetworksComponent } from './_components/_elements/experiment-all-networks/experiment-all-networks.component';
import { ExperimentNetworksListComponent } from './_components/_elements/experiments-networks-list/experiments-networks-list.component';
import { DatasetEditTableComponent } from './_components/_elements/dataset-edit-table/dataset-edit-table.component';
import { PublicProjectListComponent } from './_components/_elements/public-project-list/public-project-list.component';
import { DataSplitSliderComponent } from './_components/_elements/data-split-slider/data-split-slider.component';
import { MetricsBarplotComponent } from './_components/_elements/metrics-barplot/metrics-barplot.component';
import {MatProgressBarModule} from  '@angular/material/progress-bar';
import { InterceptorService } from './_utilities/_services/interceptor.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderNewComponent } from './_components/_elements/loader-new/loader-new.component';
import { PassChangedSuccessfulComponent } from './_components/_pages/pass-changed-successful/pass-changed-successful.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents, //ovde se nalaze sve putanje dodate u routingComponents niz u app-routing.module.ts
    FileInputComponent,
    NavbarComponent, 
    SidebarComponent,
    LoginFormComponent,
    RegistrationFormComponent, 
    RegistrationSuccessfulComponent,
    LoginFormComponent,
    NewProjectComponent,
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
    DataSetTableComponent,
    
    ChangepassFormComponent,
    ChangepassPageComponent,
    InputusernamePageComponent,
    InputusernameFormComponent,
    CreateNeuralNetworkComponent,
    DatasetOptionsComponent,
    ProjectPageStatisticsEditComponent,
    // StatisticsPageNewComponent,
    NeuralNetworkDisplayComponent,
    LandingNavComponent,
    EditProfilePageComponent,
    EditProfileFormComponent,
    StatisticsComponent,
    LandingPageSelectorComponent,

    KonfiguracijaComponent,
    TrainingPageComponent,
    NetworkListComponent,
    ChartTrainingComponent,
    PhotoInputComponent,
    NnPageComponent,
    PublicExpPageComponent,
    ProjectListComponent,
    ListControlsComponent,
    FullscreenLoaderComponent,
    TelNavComponent,
    LanguageComponent,
    ThreeBackgroundCanvasComponent,
    PageControlsComponent,
    PopupWindowComponent,
    StatisticsTableComponent,
    FallingStarParticleComponent,
    ThemeComponent,
    ExperimentAllNetworksComponent,
    ExperimentNetworksListComponent,
    DatasetEditTableComponent,
    PublicProjectListComponent,
    NetworkListComponent,
    DataSplitSliderComponent,
    MetricsBarplotComponent,
    LoaderNewComponent,
    PassChangedSuccessfulComponent,  
  ],
  imports: [
    NgxCsvParserModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NoopAnimationsModule,
    MatTooltipModule,
    MatSelectModule,
    NgChartsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    
    })
  ],

  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:InterceptorService, multi:true},
    DatasetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http);
}
