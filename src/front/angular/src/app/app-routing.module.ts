import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvComponent } from './csv/csv.component';
import { DataSetPageComponent } from './_components/_pages/data-set-page/data-set-page.component';
import { ProjectPageComponent } from './_components/_pages/project-page/project-page.component';

const routes: Routes = [
  {path:'csv',component:CsvComponent},
  {path:'project',component:ProjectPageComponent},
  {path:'dataset',component:DataSetPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//Kada se dodaje nova putanja, dodati je u niz
export const routingComponents=[CsvComponent, ProjectPageComponent, DataSetPageComponent];
