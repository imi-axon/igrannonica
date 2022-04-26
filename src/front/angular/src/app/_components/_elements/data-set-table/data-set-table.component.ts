import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  
  datasetHidden: boolean = true;
  hasPages: boolean = true;
  
  data: any;
  columns: string[];
  // AKO IMAMO STATISTIKU
  public statisticOptions: string[] = ['Minimum', 'Maximum', 'Average', 'Mediana', 'Nulls'];
  
  pageInput: number;
  
  // Stranicenje za prikaz podataka
  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  
  // Sada se koristi samo na stranici za input fajla
  @Output() loadingStartedEvent = new EventEmitter<null>();
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() loadedEvent = new EventEmitter<null>();
  
  public visible: boolean = false;
  
  ngOnInit(): void {
    
  }

  
  constructor(public statisticsService:StatisticsService) {}
  
  ngOnChanges(): void {
    
  }
  
  
  public EmptyDataset(){
    this.data = null;
    this.columns = [];
    this.visible = false;
  }
  
  
  public LoadStatisticsData(statistics: any, colnulls: any){
    this.loadingStartedEvent.emit();
    
    console.log(statistics)
    
    this.columns = this.getColumnsFromStatistics(statistics);
    this.data = this.parseStatisticsData(statistics, colnulls);
    
    console.log(this.data)
    
    this.visible = true;
    this.loadedEvent.emit();
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
  
  
  // Ovo se koristi samo na dataset stranici da bi se prikazala tabela pre nego sto je posaljemo na back
  public LoadDataDirectlyFromInput(data:Event){
    this.loadingStartedEvent.emit();
    
    this.data = data;
    console.log("Dataset iz input-a:");
    console.log(this.data);
    
    this.columns = Object.keys(this.data[0]);
    
    this.splitData(this.data);
    this.currentPage = 0;
    
    this.loadedEvent.emit();
    
    this.visible = true;
  }
  
  private splitData(data: any){
    this.dataPages = [];
    
    let arrayCounter = 0;
    this.dataPages.push([]);
    let sectionCounter = 0;
    
    for(let i = 0; i < data.length; i++){
      if(sectionCounter < this.rowsPerPage){
        this.dataPages[arrayCounter].push(data[i]);
      }
      else{
        sectionCounter = 0;
        this.dataPages.push([]);
        this.dataPages[++arrayCounter].push(data[i]);
      }
      sectionCounter++;
    }
  }
  public previousPage(){
    if(this.currentPage < 1)
      return;
    this.currentPage--;
  }
  
  public nextPage(){
    if(this.currentPage > this.dataPages.length - 2)
      return;
    this.currentPage++;
  }
  
  public minPage(){
    this.currentPage = 0;
  }
  
  public maxPage(){
    this.currentPage = this.dataPages.length - 1;
  }
  
  public goToPage(){
    if(this.pageInput == null 
      || this.pageInput <= 0 
      || this.pageInput > this.dataPages.length)
      return;
      
    this.currentPage = this.pageInput - 1;
  }
  
  
  
  

  
}
