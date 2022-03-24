import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSetPageComponent } from './_components/_pages/data-set-page/data-set-page.component';
import { HomePageComponent } from './_components/_pages/home-page/home-page.component';
import { LoginPageComponent } from './_components/_pages/login-page/login-page.component';
import { MyProjectsPageComponent } from './_components/_pages/my-projects-page/my-projects-page.component';
import { NewProjectPageComponent } from './_components/_pages/new-project-page/new-project-page.component';
import { ProjectPageComponent } from './_components/_pages/project-page/project-page.component';
import { RegistrationPageComponent } from './_components/_pages/registration-page/registration-page.component';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';
import { StatisticsPageComponent } from './_components/_pages/statistics-page/statistics-page.component';

const routes: Routes = [
  {path:'project',component:ProjectPageComponent},
  {path:'new-project', component:NewProjectPageComponent},
  {path:'dataset/:ProjectId',component:DataSetPageComponent},
  {path:'registration-successful',component:RegistrationSuccessfulComponent},
  {path:'statistics/:ProjectId', component:StatisticsPageComponent},
  {path:'login',component:LoginPageComponent},
  {path:'registration',component:RegistrationPageComponent},
  {path:'home',component:HomePageComponent},
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path:'my-projects',component:MyProjectsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Kada se dodaje nova putanja, dodati je u niz
export const routingComponents=[ProjectPageComponent, NewProjectPageComponent, DataSetPageComponent, StatisticsPageComponent, LoginPageComponent, RegistrationPageComponent,HomePageComponent,MyProjectsPageComponent];
