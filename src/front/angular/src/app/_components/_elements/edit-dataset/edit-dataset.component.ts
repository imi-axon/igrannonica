import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-edit-dataset',
  templateUrl: './edit-dataset.component.html',
  styleUrls: ['./edit-dataset.component.scss']
})
export class EditDatasetComponent implements OnInit {

  dataset: any;
  columns: string[];
  
  // Stranicenje za prikaz podataka
  dataPages: any[][] = [];
  rowsPerPage: number = 13;
  currentPage: number = 0;
  pageInput: number;
  
  // Za editovanje
  selectedColumns: boolean[] = [];
  selectAll: boolean = true;
  
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() LoadedEvent = new EventEmitter<null>();
  
  // Pokrenut event o promeni polja u datasetu
  @Output() ChangedField = new EventEmitter<any>();
  
  // Pravimo "zahtev" za update podataka
  @Output() DataUpdateNeeded = new EventEmitter<null>();
  
  // Saljemo event da zelimo da sacuvamo trenutne u trajne podatke na back-u
  @Output() SaveDataNeeded = new EventEmitter<null>();
  
  constructor(private papa: Papa) { }

  // ZA TESTIRANJE
  
  ngOnInit(): void {
    // Moze se ukljuciti za testiranje prikaza
    //this.LoadTestData();
  }
  
  
  public LoadTestData(){
    let testDataset = JSON.parse('[{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"}]');
    
    let testStatistics = JSON.parse('{"cormat":{"cols":["Kolona1","Kolona2","Kolona3","Kolona4","Kolona5"],"cors":[0.533,0.644,0,0,0.751,1,0,0.151,0.253,0.26]},"colstats":[{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0}],"rownulls":[0,1,0,1,1,0,0,2,2,0,1,2,0,2,2,3,3,2,1,2,2,2,0,1,0,0,2,1,2,3,1,0,2,2,1,3,0,1,2,0,0,0,1,3,1,2,1,0,1,0]}');
     
    this.LoadData(testDataset);
  }
  
  
  public Save(){
    this.SaveDataNeeded.emit();
  }
  
  // Odbacivanje izmena (preuzimanje starih podataka)
  public Discard(){
    this.DataUpdateNeeded.emit();
  }
  
  // Preuzimanje fajla
  public Download(){
    let datasetToCSV = this.papa.unparse(this.dataset);
    
    let file: Blob;
    file = this.convertToFile(datasetToCSV, "dataset", 'text/csv');
    
    // Da bi poziv bio asinhron
    setTimeout(() => {
      const url= window.URL.createObjectURL(file);
    
      // JAVASCRIPT DEO
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'dataset';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }
  
  private convertToFile(buffer: any, name: string, type: string) : Blob{
    let file = new Blob([buffer], {type: type});
    return file;
  }
  
  // Izmenjeno polje u datasetu
  public ChangeField(input: any, pageRow: number, col: number, currentPage: number){
    
    let row = pageRow + currentPage * this.rowsPerPage;
    //console.log("Row: " + row + " | Col: " + col);
    
    // Menjamo vrednost u celokupnom datasetu (ne verziji koja je podeljena na strane)
    this.dataset[row][this.columns[col]] = input.value;
    
    let change: any = { value: input.value, col: this.columns[col], row: row };
    this.ChangedField.emit(change);
  }
  
  // Ucitavanje
  public LoadData(dataset: any){    
    
    this.dataset = dataset;
    this.columns = Object.keys(this.dataset[0]);
    
    this.setSelectedColumns();
    
    this.splitData(this.dataset);
    this.currentPage = 0;
    
    this.LoadedEvent.emit();
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
  private setSelectedColumns(){
    this.selectedColumns = [];
    for(let i = 0; i < this.columns.length; i++)
      this.selectedColumns.push(false);
  }
  
  
  // Stranicenje
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
  
  
  // Edit
  public Select(i: number){
    this.selectedColumns[i] = !this.selectedColumns[i];
    // console.log(this.selectedColumns);
  }
  public SelectAll(){
    if(this.selectAll)
      for(let i = 0; i < this.selectedColumns.length; i++)
        this.selectedColumns[i] = true;
    else
      for(let i = 0; i < this.selectedColumns.length; i++)
        this.selectedColumns[i] = false;
    this.selectAll = !this.selectAll;
  }
  
  
  public GetSelectedColumns() : string[]{
    let columnsToChange: string[] = [];
    for(let i = 0; i < this.selectedColumns.length; i++)
      if(this.selectedColumns[i])
        columnsToChange.push(this.columns[i]);
    return columnsToChange;
  }
  
  

}
