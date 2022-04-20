import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-photo-input',
  templateUrl: './photo-input.component.html',
  styleUrls: ['./photo-input.component.scss']
})
export class PhotoInputComponent implements OnInit {

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
  
    
    constructor(private papa: Papa, public translate:TranslateService) { }
    
    ngOnInit(): void {
    }
    
    
    public AddFile(event: any){
      this.fileChosen.emit();
}
}
