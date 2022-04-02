import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  
  // Unet fajl
  public inputFile: File;
  
  // Podaci za prikaz u tabeli
  public tableData:any;
  
  // Odgovor o unosu
  public message:string;
  
  // Da li je uneti fajl spreman za slanje back-u
  public fileReadyToSend = false;
  
  // 
  @Output() fileChosen = new EventEmitter<any>();
  @Output() fileError = new EventEmitter<any>();
  @Output() jsonLoaded = new EventEmitter<any>();

  
  constructor(private papa: Papa, public translate:TranslateService) { }
  
  ngOnInit(): void {
  }
  
  
  public AddFile(event: any){
    this.fileReadyToSend = false;
    this.fileChosen.emit();
    
    this.message="";
    /* 
    const target = event.target as HTMLInputElement;
    const file:File = (target.files as FileList)[0];
    */
    
    this.inputFile = event.target.files[0];
    
    if(!this.inputFile){
      console.log("Uneti fajl nije pronadjen u input komponenti!");
      this.fileError.emit();
      return;
    }
    
    if(this.inputFile.type != "text/csv" && this.inputFile.type!="application/vnd.ms-excel"){
      //this.message = "Uneti fajl mora biti u .csv formatu!";
      this.translate.stream('csv.format').subscribe((text:string)=>this.message=text);
      this.fileError.emit();
      return;
    }
    
    this.readFile(this.inputFile);
  }
  
  // F-ja za citanje fajla
  private readFile(file: File){
    
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    
    reader.onload = (e) => {
      let fileContent = reader.result as string;
      //console.log(this.csv);
      
      if(fileContent.trim() === ""){
        //this.message = "Uneti fajl je prazan!";
        this.translate.stream('csv.prazan').subscribe((text:string)=>this.message=text);
        this.fileError.emit();
        return;
      }
      
      this.parseToJSON(fileContent);
    }
  }
  
  //F-ja za parsovanje ulaznog .csv fajla u JSON radi prikaza u tabeli
  private parseToJSON(fileContent: string){
    
    this.papa.parse(
      fileContent,
      {
        complete: (result) => {
          this.tableData = result.data;
          console.log(result);
          
          this.jsonLoaded.emit(this.tableData);
          this.fileReadyToSend = true;
        },
        error: () => {
          this.fileError.emit();
        },
        header: true
      }
    );
    
  }
  
}
