import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-edit-dataset',
  templateUrl: './edit-dataset.component.html',
  styleUrls: ['./edit-dataset.component.scss']
})
export class EditDatasetComponent implements OnInit {
  
  dataset: any;
  columns: string[];
  
  // Stranicenje za prikaz podataka
  rowsPerPage: number = 14;
  currentPage: number = 1;
  pageCount: number = 1;
  pageInput: number;
  
  // Za editovanje
  selectedColumns: boolean[] = [];
  selectAll: boolean = true;
  
  @ViewChild("loader")
  public loader: LoaderComponent;
  
  @Output() PageLoadEvent = new EventEmitter<any>();
  
  // Koristi se na stranici za input fajla i statistics stranici
  @Output() LoadedEvent = new EventEmitter<null>();
  
  // Pokrenut event o promeni polja u datasetu
  @Output() ChangedField = new EventEmitter<any>();
  
  // Pravimo "zahtev" za update podataka
  @Output() DataUpdateNeeded = new EventEmitter<any>();
  
  // Saljemo event da zelimo da sacuvamo trenutne u trajne podatke na back-u
  @Output() SaveDataNeeded = new EventEmitter<null>();
  
  // OBSOLITE - IZBACITI KADA SE BUDE VRACAO FAJL KORISNIKU
  constructor(private papa: Papa) { }

  // ZA TESTIRANJE
  
  ngOnInit(): void {
    setTimeout(() => {
      this.loader.isLoading = true;
    }, 0);
  }
  
  
  public Save(){
    this.SaveDataNeeded.emit();
  }
  
  // Odbacivanje izmena (preuzimanje starih podataka)
  public Discard(){
    this.DataUpdateNeeded.emit({currentPage: this.currentPage, rowsPerPage: this.rowsPerPage});
    this.loader.isLoading = true;
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
    
    let row = pageRow + (currentPage - 1) * this.rowsPerPage;
    
    this.dataset[row][col] = input.value;
    
    let change: any = { value: input.value, col: col, row: row };
    this.ChangedField.emit(change);
  }
  
  
  public LoadPage(dataset: any, pageCount: number){    
    
    this.dataset = JSON.parse(dataset);
    
    this.columns = Object.keys(this.dataset[0])
    
    this.setSelectedColumns();
    
    this.pageCount = pageCount;
    
    this.LoadedEvent.emit();
    
    this.loader.isLoading = false;
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
    
    let pagingData = {
      currentPage: this.currentPage, 
      rowsPerPage: this.rowsPerPage
    };
    this.PageLoadEvent.emit(pagingData);
    this.loader.isLoading = true;
  }
  
  public nextPage(){
    this.currentPage++;
    let pagingData = {
      currentPage: this.currentPage, 
      rowsPerPage: this.rowsPerPage
    };
    this.PageLoadEvent.emit(pagingData);
    this.loader.isLoading = true;
  }
  
  public minPage(){
    this.currentPage = 1;
    let pagingData = {
      currentPage: this.currentPage, 
      rowsPerPage: this.rowsPerPage
    };
    this.PageLoadEvent.emit(pagingData);
    this.loader.isLoading = true;
  }
  
  public maxPage(){
    if(this.currentPage == this.pageCount)
      return;
    
    this.currentPage = this.pageCount;
    let pagingData = {
      currentPage: this.currentPage, 
      rowsPerPage: this.rowsPerPage
    };
    this.PageLoadEvent.emit(pagingData);
    this.loader.isLoading = true;
  }
  
  public goToPage(){
    if(this.pageInput == null 
      || this.pageInput <= 0 
      || this.pageInput > this.pageCount)
      return;
    
    this.currentPage = this.pageInput;
    
    let pagingData = {
      currentPage: this.currentPage, 
      rowsPerPage: this.rowsPerPage
    };
    this.PageLoadEvent.emit(pagingData);
    this.loader.isLoading = true;
  }
  
  
  
  
  
  
  
  
  
  
  
  // SELEKTOVANJE
  
  public Select(i: number){
    this.selectedColumns[i] = !this.selectedColumns[i];
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
