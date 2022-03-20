import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  

  testJSON:any = JSON.parse('[{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"}]');
  
  datasetHidden:boolean = true;
  dataJSON: any;
  keys : any;
  
  
  // Stranicenje
  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  
  
  // Neophodna promenljivo ako je potrebno prikazati podatke u tabeli na load-u
  @Input() onBind: boolean;
  
  public pageInput: number;
  
  ngOnInit(): void {
    
  }

  
  constructor(private datasetService: DatasetService) {}
  
  // Ovde se nalazi funkcija za unos podataka na load-u samo na stranicama gde je to potrebno
  ngOnChanges(): void {
    this.LoadDataFromAPI();
  }
  
  
  public LoadDataFromAPI(){
    this.datasetService.getCSV(1, this, this.successfulLoad);
  }
  public successfulLoad(self:any, data: any){
    console.log("Ucitan datase. Obavestite u Discordu ako se ovo ispise vise puta.");
    // self.dataJSON = self.testJSON;
    self.dataJSON = data;
    console.log("Local dataset: " + self.dataJSON);
    self.keys = Object.keys(self.dataJSON[0]);
    
    self.splitData(self.dataJSON);
    self.currentPage = 0;
  }
  
  
  // Ovo se koristi samo na dataset stranici da bi se prikazala tabela pre nego sto je posaljemo na back
  public LoadDataDirectlyFromInput(data:Event){
    this.dataJSON = data;
    console.log("Dataset from API: " + this.dataJSON);
    this.keys = Object.keys(this.dataJSON[0]);
    
    this.splitData(this.dataJSON);
    this.currentPage = 0;
  }
  
  // TRENUTNO ZA TESTIRANJE BEZ BACKENDA
  public LoadDummyData(){
    this.dataJSON = this.testJSON;
    this.keys = Object.keys(this.dataJSON[0]);
    this.datasetHidden = false;
    
    this.splitData(this.dataJSON);
    this.currentPage = 0;
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
      sectionCounter++
    }
    
    console.log(this.dataPages);
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
