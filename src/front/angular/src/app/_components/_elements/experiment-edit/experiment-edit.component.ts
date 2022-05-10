import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
import { CorrelationTableComponent } from '../correlation-table/correlation-table.component';
import { DataSetTableComponent } from '../data-set-table/data-set-table.component';

@Component({
  selector: 'app-experiment-edit',
  templateUrl: './experiment-edit.component.html',
  styleUrls: ['./experiment-edit.component.scss']
})
export class ExperimentEditComponent implements OnInit {
  constructor( 
    private activatedRoute : ActivatedRoute,
    private statisticsService: StatisticsService
  ) { }
  
  
  // KOMPONENTE ===============================================
  
  @ViewChild("correlationComponent")
  private correlationComponent: CorrelationTableComponent;
  
  @ViewChild("statisticsComponent")
  private statisticsComponent: DataSetTableComponent;
  
  // KRAJ KOMPONENTI ==========================================
  
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  ngOnInit(): void {
    this.statisticsService.GetStatistics(this.getProjectId(), true, this, this.handleStatisticsGetSuccess);
  }
  
  
  
  
  
  
  
  
  
  
  // STATISTIKA =============================================================================================
  
  private handleStatisticsGetSuccess(self: any, response: any){
    let statistics = JSON.parse(response.statistics);
    
    let correlationMatrix = self.parseCorrelationData(statistics.cormat.cols, statistics.cormat.cors);
    
    self.correlationComponent.LoadCorrelationData(statistics.cormat.cols, correlationMatrix);
    
    let columnStats = statistics.colstats;
    let colnulls = statistics.colnulls;
    
    self.statisticsComponent.LoadStatisticsData(columnStats, colnulls);
  }
  
  
  public parseCorrelationData(columns: string[], cormat: number[]){
    
    let columnsCount = columns.length;
    
    // MATRICA KOJA SADRZI KORELACIONE VREDNOSTI
    let parsedMatrix : number[][] = [];
    
    // POPUNIMO MATRICU JEDINICAMA (POCETNE VREDNOSTI, KASNIJE IH MENJAMO)
    for(let i = 0; i < columnsCount; i++){
      parsedMatrix.push([]);
      for(let j = 0; j < columnsCount; j++)
        parsedMatrix[i].push(1);
    }
    
    let i = 1;
    let j = 0;
    for(let k = 0; k < cormat.length; k++){
      parsedMatrix[i][j] = parsedMatrix[j][i] = cormat[k];
      if(i == ++j){
        i++;
        j = 0;
      }
    }
    
    return parsedMatrix;
  }
  
  // KRAJ STATISTIKE ========================================================================================

}
