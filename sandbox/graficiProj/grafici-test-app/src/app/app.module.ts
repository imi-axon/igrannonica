import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { LineChartComponent } from './Components/line-chart/line-chart.component';
import { ScatterChartComponent } from './Components/scatter-chart/scatter-chart.component';
import { NnComponent } from './Components/nn/nn.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    ScatterChartComponent,
    NnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    NgxGraphModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
