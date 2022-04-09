import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditDatasetComponent } from './_components/_elements/edit-dataset/edit-dataset.component';
import { StatisticsComponent } from './_components/_elements/statistics/statistics.component';
import { NeuralNetworkDisplayComponent } from './_components/_elements/neural-network-display/neural-network-display.component';
import { ChangepassPageComponent } from './_components/_pages/changepass-page/changepass-page.component';
import { DataSetPageComponent } from './_components/_pages/data-set-page/data-set-page.component';
// import { EditDatasetPageComponent } from './_components/_pages/edit-dataset-page/edit-dataset-page.component';
import { EditProfilePageComponent } from './_components/_pages/edit-profile-page/edit-profile-page.component';
import { HomePageComponent } from './_components/_pages/home-page/home-page.component';
import { InputusernamePageComponent } from './_components/_pages/inputusername-page/inputusername-page.component';
import { LoginPageComponent } from './_components/_pages/login-page/login-page.component';
import { MyProjectsPageComponent } from './_components/_pages/my-projects-page/my-projects-page.component';
import { NewProjectPageComponent } from './_components/_pages/new-project-page/new-project-page.component';
import { ProfilPageComponent } from './_components/_pages/profil-page/profil-page.component';
import { ProjectPageStatisticsEditComponent } from './_components/_pages/project-page-statistics-edit/project-page-statistics-edit.component';
import { ProjectPageComponent } from './_components/_pages/project-page/project-page.component';
import { RegistrationPageComponent } from './_components/_pages/registration-page/registration-page.component';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';
import { StatisticsPageComponent } from './_components/_pages/statistics-page/statistics-page.component';
import { VerificationComponent } from './_components/_pages/verification-page/verification.component';
import { TrainingPageComponent } from './_components/_pages/training-page/training-page.component';

const routes: Routes = [
 // {path:'train/:ProjectId/:Inputs/:Outputs',component:ProjectPageComponent},
 {path:'train/:ProjectId', component:TrainingPageComponent},
  {path:'new-project', component:NewProjectPageComponent},
  {path:'dataset/:ProjectId',component:DataSetPageComponent},
  {path:'registration-successful',component:RegistrationSuccessfulComponent},
  //{path:'statistics/:ProjectId',component:StatisticsPageNewComponent}, 
  {path:'login',component:LoginPageComponent},
  {path:'registration',component:RegistrationPageComponent},
  {path:'home',component:HomePageComponent},
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path:'my-projects',component:MyProjectsPageComponent},
  {path:'profil', component:ProfilPageComponent},
  {path:'verification', component:VerificationComponent},
  {path: 'changepass', component:ChangepassPageComponent},

  //{path:'edit-dataset/:ProjectId', component:EditDatasetPageComponent},
  {path:'input-username', component:InputusernamePageComponent},

  {
    path:'project/:ProjectId',
    component:ProjectPageStatisticsEditComponent,
    children:[
      {path:'',component:StatisticsComponent},
      {path:'statistics', component:StatisticsComponent},
      {path:'edit',component:EditDatasetComponent}
    ]
  }
  //TESTIRANJE - OBRISATI KASNIJE
  , {path:'neural-network-display', component:NeuralNetworkDisplayComponent}
  , {path:'edit-profile', component:EditProfilePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Kada se dodaje nova putanja, dodati je u niz
export const routingComponents=[ProjectPageComponent, NewProjectPageComponent,
   DataSetPageComponent, StatisticsPageComponent, LoginPageComponent, RegistrationPageComponent,

   HomePageComponent,MyProjectsPageComponent,ProfilPageComponent,VerificationComponent,ProjectPageStatisticsEditComponent,
  StatisticsComponent,EditDatasetComponent,TrainingPageComponent

  //TESTIRANJE - OBRISATI KASNIJE
  ,NeuralNetworkDisplayComponent];
