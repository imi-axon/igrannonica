import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'correlation-table',
  templateUrl: './correlation-table.component.html',
  styleUrls: ['./correlation-table.component.scss']
})
export class CorrelationTableComponent implements OnInit {
  
  constructor() { }

  public columns: string[];
  public correlationMatrix: number[][];
  
  ngOnInit(): void {
    
  }
  
  public LoadCorrelationMatrix(columns: string[], correlationMatrix: number[][]){
    this.columns = columns;
    this.correlationMatrix = correlationMatrix;
  }
  
  
  public GetCorrelationColor(value: number){
    if(value >= 0.75)
      return {'color': 'rgb( 0, 150, 0)', 'font-weight': 'bold'}
    
    if(value <= 0.25)
      return {'color': 'rgb( 150, 0, 0)', 'font-weight': 'bold'}
      
    return {'color': 'rgb( 70, 70, 70)', 'font-weight': 'bold'};
  }
}
