import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditDatasetComponent } from './_components/_elements/edit-dataset/edit-dataset.component';
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
import { RegistrationPageComponent } from './_components/_pages/registration-page/registration-page.component';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';
import { VerificationComponent } from './_components/_pages/verification-page/verification.component';
import { StatisticsComponent } from './_components/_elements/statistics/statistics.component';
import { TrainingPageComponent } from './_components/_pages/training-page/training-page.component';
import { CreateNeuralNetworkComponent } from './_components/_elements/create-neural-network/create-neural-network.component';
import { NnPageComponent } from './_components/_pages/nn-page/nn-page.component';
import { PublicExpPageComponent } from './_components/_pages/public-exp-page/public-exp-page.component';
import { ExperimentOverviewComponent } from './_components/_elements/experiment-overview/experiment-overview.component';
import { ExperimentDatasetComponent } from './_components/_elements/experiment-dataset/experiment-dataset.component';
import { ExperimentNetworkComponent } from './_components/_elements/experiment-network/experiment-network.component';
import { ExperimentPageComponent } from './_components/_pages/experiment-page/experiment-page.component';

const routes: Routes = [
 // {path:'train/:ProjectId/:Inputs/:Outputs',component:ProjectPageComponent},
 {path:'train/:ProjectId/nn/:NNId', component:TrainingPageComponent},
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
  {path:'public_exp',component:PublicExpPageComponent},

  //{path:'edit-dataset/:ProjectId', component:EditDatasetPageComponent},
  {path:'input-username', component:InputusernamePageComponent},
  {path:'project/:ProjectId/nns',component:NnPageComponent},

  {
    path:'project/:ProjectId',
    component:ExperimentPageComponent,
    children:[
      {path:'',component:ExperimentOverviewComponent},
      {path:'dataset', component:ExperimentDatasetComponent},
      {path:'network',component:ExperimentNetworkComponent}
    ]
  }
  //TESTIRANJE - OBRISATI KASNIJE
  , {path:'neural-network-display', component:NeuralNetworkDisplayComponent}
  , {path:'edit-profile', component:EditProfilePageComponent},
  {path:'new-nn',component:CreateNeuralNetworkComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Kada se dodaje nova putanja, dodati je u niz
export const routingComponents=[
  NewProjectPageComponent,
  DataSetPageComponent, LoginPageComponent, RegistrationPageComponent,
  
  HomePageComponent,MyProjectsPageComponent,ProfilPageComponent,VerificationComponent,ProjectPageStatisticsEditComponent,
  StatisticsComponent,EditDatasetComponent,TrainingPageComponent,CreateNeuralNetworkComponent,NnPageComponent,PublicExpPageComponent,

  //TESTIRANJE - OBRISATI KASNIJE
  NeuralNetworkDisplayComponent];
