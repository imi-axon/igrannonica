import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss']
})
export class StatisticsTableComponent implements OnInit {
  
  constructor() { }
  
  @Output() LoadedEvent = new EventEmitter<null>();
  
  statistics: any;
  columns: string[] = [];
  statTypes: string[] = [];

  ngOnInit(): void {
    
  }
  
  public LoadStatisticsData(statistics: any){
    // this.columns = this.getColumnsFromStatistics(statistics);
    // this.statistics = this.parseStatisticsData(statistics, colnulls);

    // Ukoliko ne postoje statisticki podaci za ovu tabelu prekinuti izvrsavanje funkcije
    if (statistics.length == 0)
      return;

    this.statistics =  statistics;
    
    this.columns = [];
    for(let i = 0; i < statistics.length; i++)
      this.columns.push(statistics[i].col);
      
    this.statTypes = Object.keys(statistics[0]);
    this.statTypes.splice(0, 1);
    
    this.LoadedEvent.emit();
  }
  
  
  
  /*
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
  */
 
}
