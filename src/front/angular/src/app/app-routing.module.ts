import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvComponent } from './csv/csv.component';
import { DataSetPageComponent } from './_components/_pages/data-set-page/data-set-page.component';
import { ProjectPageComponent } from './_components/_pages/project-page/project-page.component';
import { RegistrationPageComponent } from './_components/_pages/registration-page/registration-page.component';
import { RegistrationSuccessfulComponent } from './_components/_pages/registration-successful/registration-successful.component';

const routes: Routes = [
  {path:'project',component:ProjectPageComponent},
  {path:'dataset',component:DataSetPageComponent},
  {path:'registration',component:RegistrationPageComponent},
  
  {path:'registration-successful',component:RegistrationSuccessfulComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Kada se dodaje nova putanja, dodati je u niz
export const routingComponents=[ProjectPageComponent, DataSetPageComponent, RegistrationPageComponent];
