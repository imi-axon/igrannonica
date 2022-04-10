import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
import { CorrelationTableComponent } from '../correlation-table/correlation-table.component';
import { DataSetTableComponent } from '../data-set-table/data-set-table.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  public ProjectId: number;
  
  constructor(private statisticsAPI: StatisticsService, private activatedRoute: ActivatedRoute) { }
  
  //testCorrelation: any = JSON.parse('{"cormat":{"cols":["Kolona1","Kolona2","Kolona3","Kolona4","Kolona5"],"cors":[0.533,0.644,0,0,0.751,1,0,0.151,0.253,0.26]},"colstats":[{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0}],"rownulls":[0,1,0,1,1,0,0,2,2,0,1,2,0,2,2,3,3,2,1,2,2,2,0,1,0,0,2,1,2,3,1,0,2,2,1,3,0,1,2,0,0,0,1,3,1,2,1,0,1,0]}');
  
  // Promenljive
  public columns: string[];
  public correlationMatrix: number[][];
  public columnStats: any;
  public rowNulls: number[];
  
  // Komponente
  @ViewChild('correlationTable')
  public correlationTable: CorrelationTableComponent;
  
  @ViewChild('statisticsTable')
  public statisticsTable: DataSetTableComponent;
  
  ngOnInit(): void {
    setTimeout(() => {
      this.checkProjectId();
      
      this.statisticsAPI.GetStatistics(this.ProjectId, true, this, this.LoadAndUpdate);
    }, 0);
  }
  
  // UZIMAMAMO projectId
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) 
      this.ProjectId = p as unknown as number;
  }
  
  public LoadAndUpdate(self: any, response: any){
    let statistics = JSON.parse(response);
    self.columns = statistics.cormat.cols;
    self.correlationMatrix = self.ParseCorrelationData(statistics.cormat.cols, statistics.cormat.cors);
    self.columnStats = statistics.colstats;
    self.rowNulls = statistics.rownulls;
    
    self.correlationTable.LoadCorrelationMatrix(self.columns, self.correlationMatrix);
    
    self.statisticsTable.LoadStatisticsData(self.columnStats);
    
    self.statisticsTable.hasPages = false;
  }
  
  public ParseCorrelationData(columns: string[], cormat: number[]){
    
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
    
    console.log("Korelaciona matrica: ")
    console.log(parsedMatrix);
    
    return parsedMatrix;
  }
  
  
  
  
  
  
  
  
  
}
