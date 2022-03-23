import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'correlation-table',
  templateUrl: './correlation-table.component.html',
  styleUrls: ['./correlation-table.component.scss']
})
export class CorrelationTableComponent implements OnInit {
  
  headers: string[] = [];
  correlationMatrix: number[][] = [];
  
  
  constructor() { }

  ngOnInit(): void {
    
  }
  
  
  public ParseCorrelationData(correlationData: any){
    let correlation = correlationData;
    
    let columnsCount = correlation.cols.length;
    let corrCount = correlation.cors.length;
    
    // MATRICA KOJA SADRZI KORELACIONE VREDNOSTI
    this.correlationMatrix = [];
    this.headers = [];
    for(let i = 0; i < columnsCount; i++){
      
      // LISTA KOJA SADRZI NAZIVE KOLONA
      this.headers.push(correlation.cols[i]);
      this.correlationMatrix.push([]);
      for(let j = 0; j < columnsCount; j++)
        this.correlationMatrix[i].push(1);
    }
    
    let i = 1;
    let j = 0;
    for(let k = 0; k < corrCount; k++){
      this.correlationMatrix[i][j] = this.correlationMatrix[j][i] = correlation.cors[k];
      if(i == ++j){
        i++;
        j = 0;
      }
    }
  }

  
  public GetCorrelationColor(value: number){
    if(value >= 0.75)
      return {'color': 'rgb( 70, 200, 70)', 'font-weight': 'bold'}
    
    if(value <= 0.25)
      return {'color': 'rgb( 200, 70, 70)', 'font-weight': 'bold'}
      
    return {'color': 'rgb( 100, 100, 100)', 'font-weight': 'bold'};
  }
  
}
