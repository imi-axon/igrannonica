import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }
  public headers: string[] = [];
  public correlationMatrix: number[][] = [];

  public datasetHidden:boolean = true;
  public dataset: any;
  public columns: string[];
  public statistics: any;
  public rowNulls: number[];
  public statisticsOptions: string[] = ["Minimum","Maximum", "Average", "Median", "Null"];
  public statisticsArrays: number[][] = [];
  public selectedOption: number = 0;
  public pageInput: number;

  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  rowNullsPages: any[][] = [];

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

    console.log("korelaciona matrica headers" + this.headers);
    console.log("korelaciona matrica" + this.correlationMatrix);
    
  }

  
  public GetCorrelationColor(value: number){
    if(value >= 0.75)
      return {'color': 'rgb( 70, 200, 70)', 'font-weight': 'bold'}
    
    if(value <= 0.25)
      return {'color': 'rgb( 200, 70, 70)', 'font-weight': 'bold'}
      
    return {'color': 'rgb( 100, 100, 100)', 'font-weight': 'bold'};
  }




  public LoadDataAndStatistics(dataset: any, statistics: any, rowNulls: any){    
    
    this.dataset = dataset;
    console.log("Dataset iz statistics stranice:");
    console.log(this.dataset);
    
    this.columns = Object.keys(this.dataset[0]);
    this.statistics = statistics;
    this.rowNulls = rowNulls;

    this.columns=this.columns;
    this.statistics=this.statistics;
    this.rowNulls=this.rowNulls;
    
    this.datasetHidden = false;
    
    this.splitDataAndNulls(this.dataset, this.rowNulls);
    this.currentPage = 0;
    
    this.createStatisticsArrays(this.statistics);
    
   // this.loadedEvent.emit();
  }
  
  public shiftTroughStatisticsOptions(){
    if(this.selectedOption == (this.statisticsOptions.length - 1))
      this.selectedOption = 0;
    else
      this.selectedOption++;

      this.selectedOption=this.selectedOption;
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
    this.statisticsArrays=this.statisticsArrays;

    
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
