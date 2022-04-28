import { Component, OnChanges, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  
  @Output() LoadedEvent = new EventEmitter<null>();
  
  dataset: any;
  columns: string[];
  
  
  
  ngOnInit(): void {
    
  }

  
  constructor() {}
  
  ngOnChanges(): void {
    
  }
  
  // NORMALAN DATASET 
  public LoadDataset(dataset: any){
    this.dataset = dataset;
    this.columns = Object.keys(dataset[0]);
    this.LoadedEvent.emit();
  }
  
  public GetRowData(row: any){
    return Object.values(row)
  }
  
  // ========================= STATISTIKA ========================= //
  
  public LoadStatisticsData(statistics: any, colnulls: any){
    this.columns = this.getColumnsFromStatistics(statistics);
    this.dataset = this.parseStatisticsData(statistics, colnulls);
    
    this.LoadedEvent.emit();
  }
  
  private getColumnsFromStatistics(statistics: any){
    let columnsCount = statistics.length;
    let columns = [];
    
    for(let i = 0; i < columnsCount; i++)
      columns.push(statistics[i].col)
      
    return columns;
  }
  
  private parseStatisticsData(statistics: any, colnulls: any){
    let statisticsData = [];
    let columnsCount = statistics.length;
    
    let minRows = [];
    let maxRows = [];
    let avgRows = [];
    let medRows = [];
    let nulRows = [];
    
    for(let i = 0; i < columnsCount; i++){
      minRows.push(statistics[i].min)
      maxRows.push(statistics[i].max)
      avgRows.push(statistics[i].avg)
      medRows.push(statistics[i].med)
      nulRows.push(colnulls.nulls[i])
    }
    
    statisticsData.push(minRows);
    statisticsData.push(maxRows);
    statisticsData.push(avgRows);
    statisticsData.push(medRows);
    statisticsData.push(nulRows);
    
    return statisticsData;
  }

  
}
