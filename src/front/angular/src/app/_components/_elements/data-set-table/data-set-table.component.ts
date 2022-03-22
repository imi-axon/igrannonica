import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  
  datasetHidden:boolean = true;
  dataJSON: any;
  columns : any;
  
  testJSON:any = JSON.parse('[{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"}]');
  
  // Stranicenje
  dataPages: any[][] = [];
  rowsPerPage: number = 20;
  currentPage: number = 0;
  
  // Neophodna promenljivo ako je potrebno prikazati podatke u tabeli na load-u
  @Input() onBind: boolean;
  
  @Output() loadingStartedEvent = new EventEmitter<null>();
  @Output() loadedEvent = new EventEmitter<null>();
  
  public pageInput: number;
  
  ngOnInit(): void {
    
  }

  
  constructor(private datasetService: DatasetService) {}
  
  // Ovde se nalazi funkcija za unos podataka na load-u samo na stranicama gde je to potrebno
  ngOnChanges(): void {
    // UKLJUCITI KADA SE BUDE TESTIRALO LOAD-OVANJE PODATAKA ON-INIT/ON-LOAD
    //this.LoadDataFromAPI();
  }
  
  
  public LoadDataFromAPI(){
    setTimeout(()=> {
      this.loadingStartedEvent.emit();
    }, 0);
    this.datasetService.GetDataset(1, this, this.handleSuccessfulLoad, this.handleNotLoggedIn, this.handleForbidden, this.handleNotFound);
  }
  
  public handleNotLoggedIn(self:any, message: string){
    
    self.loadedEvent.emit();
  }
  
  public handleForbidden(self:any, message: string){
    
    self.loadedEvent.emit();
  }
  
  public handleNotFound(self:any, message: string){
    
    self.loadedEvent.emit();
  }
  
  public handleSuccessfulLoad(self:any, data: any){
    self.dataJSON = data;
    console.log("API dataset: " + self.dataJSON);
    self.columns = Object.keys(self.dataJSON[0]);
    
    self.splitData(self.dataJSON);
    self.currentPage = 0;
    
    self.loadedEvent.emit();
  }
  
  
  // Ovo se koristi samo na dataset stranici da bi se prikazala tabela pre nego sto je posaljemo na back
  public LoadDataDirectlyFromInput(data:Event){
    this.loadingStartedEvent.emit();
    
    this.dataJSON = data;
    this.columns = Object.keys(this.dataJSON[0]);
    
    this.splitData(this.dataJSON);
    this.currentPage = 0;
    
    this.loadedEvent.emit();
  }
  
  // TRENUTNO ZA TESTIRANJE BEZ BACKENDA
  public LoadDummyData(){    
    this.loadingStartedEvent.emit();
    setTimeout(()=> {
    
      console.log(this.testJSON);
      
      this.dataJSON = this.testJSON;
      this.columns = Object.keys(this.dataJSON[0]);
      
      this.datasetHidden = false;
      
      this.splitData(this.dataJSON);
      this.currentPage = 0;
      
      this.loadedEvent.emit();
    
    }, 5000);
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
