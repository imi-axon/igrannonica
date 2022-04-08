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
  
  datasetHidden:boolean = true;
  dataset: any;
  columns: string[];
  statistics: any;
  rowNulls: number[];
  public pageInput: number;
  
  // Stranicenje za prikaz podataka
  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  rowNullsPages: any[][] = [];
  
  // Sada se koristi samo na stranici za input fajla
  @Output() loadingStartedEvent = new EventEmitter<null>();
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() loadedEvent = new EventEmitter<null>();
  
  public visible: boolean = false;
  
  showsStatistics: boolean = true;
  
  ngOnInit(): void {
    
  }

  
  constructor(public statisticsService:StatisticsService) {}
  
  ngOnChanges(): void {
    
  }
  
  
  public EmptyDataset(){
    this.dataset = null;
    this.columns = [];
    this.statistics = null;
    this.rowNulls = [];
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
