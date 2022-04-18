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
  rowsPerPage: number = 13;
  currentPage: number = 1;
  pageCount: number = 5;
  pageInput: number;
  
  // Za editovanje
  selectedColumns: boolean[] = [];
  selectAll: boolean = true;
  
  
  @Output() PageLoadEvent = new EventEmitter<number>();
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() LoadedEvent = new EventEmitter<null>();
  
  // Pokrenut event o promeni polja u datasetu
  @Output() ChangedField = new EventEmitter<any>();
  
  // Pravimo "zahtev" za update podataka
  @Output() DataUpdateNeeded = new EventEmitter<number>();
  
  // Saljemo event da zelimo da sacuvamo trenutne u trajne podatke na back-u
  @Output() SaveDataNeeded = new EventEmitter<null>();
  
  // OBSOLITE - IZBACITI KADA SE BUDE VRACAO FAJL KORISNIKU
  constructor(private papa: Papa) { }

  // ZA TESTIRANJE
  
  ngOnInit(): void {
    // Moze se ukljuciti za testiranje prikaza
    //this.LoadTestData();
  }
  
  
  public Save(){
    this.SaveDataNeeded.emit();
  }
  
  // Odbacivanje izmena (preuzimanje starih podataka)
  public Discard(){
    this.DataUpdateNeeded.emit(this.currentPage);
  }
  
  
  // OBSOLITE - IZBACITI KADA SE BUDE VRACAO FAJL KORISNIKU
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
  
  // OBSOLITE - IZBACITI KADA SE BUDE VRACAO FAJL KORISNIKU
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
  public GetPage(dataset: any){    
    
    this.dataset = dataset;
    this.columns = Object.keys(this.dataset[0]);
    
    this.setSelectedColumns();
    
    
  }
  
  public LoadPage(dataset: any, pageCount: number){    
    
    this.dataset = dataset;
    this.columns = Object.keys(this.dataset[0]);
    
    this.setSelectedColumns();
    
    this.pageCount = pageCount;
    
    this.LoadedEvent.emit();
  }
  
  private setSelectedColumns(){
    this.selectedColumns = [];
    for(let i = 0; i < this.columns.length; i++)
      this.selectedColumns.push(false);
  }
  
  
  
  
  
  
  
  
  
  
  
  // STRANICENJE
  
  public previousPage(){
    if(this.currentPage <= 1)
      return;
    this.currentPage--;
    this.PageLoadEvent.emit(this.currentPage);
    
  }
  
  public nextPage(){
    this.currentPage++;
    this.PageLoadEvent.emit(this.currentPage);
    
  }
  
  public minPage(){
    this.currentPage = 1;
    this.PageLoadEvent.emit(this.currentPage);
    
  }
  
  public maxPage(){
    if(this.currentPage = this.pageCount)
      return;
    
    // TRENUTNO NEMA FUNKCIONALNOST -- NE ZNAMO KOJA JE MAKS STRANA
    
    this.currentPage = this.pageCount;
    this.PageLoadEvent.emit(this.currentPage);
  }
  
  public goToPage(){
    if(this.pageInput == null 
      || this.pageInput <= 0 
      || this.pageInput > this.pageCount)
      return;
      
    this.currentPage = this.pageInput - 1;
    
    this.PageLoadEvent.emit(this.currentPage);
  }
  
  
  
  
  
  
  
  
  
  
  
  // SELEKTOVANJE
  
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
