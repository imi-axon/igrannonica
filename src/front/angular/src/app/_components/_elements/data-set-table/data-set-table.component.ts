import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  
  datasetHidden:boolean = true;
  dataset: any;
  columns: string[];
  statistics: any;
  rowNulls: number[];
  
  // Stranicenje za prikaz podataka
  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  rowNullsPages: any[][] = [];
  
  // Sada se koristi samo na stranici za input fajla
  @Output() loadingStartedEvent = new EventEmitter<null>();
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() loadedEvent = new EventEmitter<null>();
  
  
  
  
  
  public statisticsOptions: string[] = ["Minimum","Maximum", "Average", "Median", "Null"];
  public statisticsArrays: number[][] = [];
  public selectedOption: number = 0;
  public pageInput: number;
  
  public visible: boolean = false;
  
  showsStatistics: boolean = true;
  
  ngOnInit(): void {
    
  }

  
  constructor() {}
  
  ngOnChanges(): void {
    
  }
  
  
  
  
  
  // Ovo se koristi samo na dataset stranici da bi se prikazala tabela pre nego sto je posaljemo na back
  public LoadDataDirectlyFromInput(data:Event){
    this.loadingStartedEvent.emit();
    
    this.dataset = data;
    console.log("Dataset iz input-a:");
    console.log(this.dataset);
    
    this.columns = Object.keys(this.dataset[0]);
    
    this.splitData(this.dataset);
    this.currentPage = 0;
    
    this.loadedEvent.emit();
    
    this.visible = true;
    this.showsStatistics = false;
  }
  
  public LoadDataAndStatistics(dataset: any, statistics: any, rowNulls: any){    
    
    this.dataset = dataset;
    console.log("Dataset iz statistics stranice:");
    console.log(this.dataset);
    
    this.columns = Object.keys(this.dataset[0]);
    this.statistics = statistics;
    this.rowNulls = rowNulls;
    
    this.datasetHidden = false;
    
    this.splitDataAndNulls(this.dataset, this.rowNulls);
    this.currentPage = 0;
    
    this.createStatisticsArrays(this.statistics);
    
    this.loadedEvent.emit();
  }
  
  
  private createStatisticsArrays(statistics: any){
    this.statisticsArrays = [];
    this.selectedOption = 0;
    
    console.log(this.statistics)
    // Iteracija kroz sve moguce opcije (pravimo po niz za min, max, avg, ...)
    for(let i = 0; i < this.statisticsOptions.length; i++)
      this.statisticsArrays.push([]);
    
    // Iteracija kroz sve primljene kolone i njihove statistike (upisujemo u svaki od napravljenih nizova)
    for(let i = 0; i < this.statistics.length; i++){
      this.statisticsArrays[0].push(this.statistics[i]['min']);
      this.statisticsArrays[1].push(this.statistics[i]['max']);
      this.statisticsArrays[2].push(this.statistics[i]['avg']);
      this.statisticsArrays[3].push(this.statistics[i]['med']);
      this.statisticsArrays[4].push(this.statistics[i]['nul']);
    }
    
  }
  public shiftTroughStatisticsOptions(){
    if(this.selectedOption == (this.statisticsOptions.length - 1))
      this.selectedOption = 0;
    else
      this.selectedOption++;
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
  
  private splitDataAndNulls(data: any, rowNulls: any){
    this.dataPages = [];
    this.rowNulls = [];
    
    let arrayCounter = 0;
    
    this.dataPages.push([]);
    this.rowNullsPages.push([]);
    
    let sectionCounter = 0;
    
    for(let i = 0; i < data.length; i++){
      if(sectionCounter < this.rowsPerPage){
        this.dataPages[arrayCounter].push(data[i]);
        
        this.rowNullsPages[arrayCounter].push(rowNulls[i]);
      }
      else{
        sectionCounter = 0;
        
        this.dataPages.push([]);
        this.dataPages[++arrayCounter].push(data[i]);
        
        this.rowNullsPages.push([]);
        this.rowNullsPages[arrayCounter].push(rowNulls[i]);
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
