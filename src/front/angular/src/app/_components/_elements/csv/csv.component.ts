import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxCsvParser } from 'ngx-csv-parser';

@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.scss']
})
export class CsvComponent implements OnInit {
  
  public csvDelimiter:string = ';';
  
  public tableData:any;
  public poruka:string;
  @Output() public csv:string;
  
  @Output() jsonLoaded = new EventEmitter<any>();
  @Output() fileError = new EventEmitter<any>();
  @Output() fileChosen = new EventEmitter<any>();

  
  constructor(private ngxCsvParser: NgxCsvParser) { }
  
  ngOnInit(): void {
  }
  
  
  public izabranFajl(event: Event){
    this.fileChosen.emit();
    
    //console.log(event);
    this.poruka="";
    const target = event.target as HTMLInputElement;
    const file:File = (target.files as FileList)[0];
    
    if(!file){
      console.log("Uneti fajl nije pronadjen u input komponenti!");
      this.fileError.emit();
      return;
    }
    
    if(file.type != "text/csv" && file.type!="application/vnd.ms-excel"){
      this.poruka = "Uneti fajl mora biti u .csv formatu!";
      this.fileError.emit();
      return;
    }
    
    //console.log(file.name);
    //console.log(file.size);
    //console.log(file.type);
    
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      this.csv = reader.result as string;
      //console.log(this.csv);
      
      if(this.csv.trim() === ""){
        this.poruka = "Uneti fajl ne sme biti prazan!";
        this.fileError.emit();
        return;
      }
      
      this.parseToJSON(file);
    }
  }
  
  //F-ja za parsovanje ulaznog .csv fajla u JSON radi prikaza u tabeli
  private parseToJSON(file: File){
    this.ngxCsvParser.parse(file, { header: true, delimiter: this.csvDelimiter } )
    .subscribe(
      (next: any) =>{
        //console.log('Result', next);
        this.tableData = next;
        
        this.jsonLoaded.emit(this.tableData);
      }
    ); 
  }
  
}
