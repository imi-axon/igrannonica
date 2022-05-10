import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  
  public inputFile: File;
  public errorMessage: String = "";
  public showsError = false;
  
  @ViewChild("fileInput")
  private fileInput: ElementRef;
  
  @Output() fileChosen = new EventEmitter<null>();
  @Output() fileError = new EventEmitter<null>();
  @Output() fileSubmited = new EventEmitter<File>();

  
  constructor(private papa: Papa, public translate:TranslateService) { }
  
  ngOnInit(): void {
  }
  
  
  public AddFile(event: any){
    this.fileChosen.emit();
    this.showsError = false;
    
    this.inputFile = event.target.files[0];
    
    if(!this.inputFile){
      console.log("Uneti fajl nije pronadjen u input komponenti!");
      this.errorMessage = "nemaFajla";
      this.showsError = true;
      this.fileError.emit();
      return;
    }
    
    if(this.inputFile.type != "text/csv" && this.inputFile.type!="application/vnd.ms-excel"){
      this.errorMessage = "pogresanTipFajla";
      this.showsError = true;
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
        this.errorMessage = "prazanFajl";
        this.showsError = true;
        this.fileError.emit();
        return;
      }
      
      this.fileSubmited.emit(file);
    }
  }
  
  
  
  
  // Fajl prevucen preko inputa ==========
  
  public onDragEnter(event: any){
    this.fileInput.nativeElement.classList.add("dragHovering");
    console.log("EVENT")
  }
  
  public onDragLeave(event: any){
    this.fileInput.nativeElement.classList.remove("dragHovering");
  }
  
}
