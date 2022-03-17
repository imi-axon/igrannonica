import { Target } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CsvServiceService } from '../services/csv-service.service';
import { observable } from 'rxjs';

@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.scss']
})
export class CsvComponent implements OnInit {

  public poruka:string;
  public csv:string;
  
  @Output() messageEvent = new EventEmitter<any>();

  constructor(private service:CsvServiceService) { }
  
  public data : any;
  
  ngOnInit(): void {
  }
  
  public changeListener(event: Event){
    this.poruka="";
    console.log(event);
    const target = event.target as HTMLInputElement;
    const file:File = (target.files as FileList)[0];
    
    if(file) {
         //console.log(file.name);
         //console.log(file.size);
         //console.log(file.type);

      //Provera da li je fajl .csv
      if(file.type=="text/csv" || file.type=="application/vnd.ms-excel"){
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            this.csv = reader.result as string;
            //console.log(this.csv);
          //salje se csv fajl servisu u vidu stringa
          if(this.csv!="")
            this.service.prihvatiCsvString(this.csv).subscribe(
              (response) => {
                this.data = response.body;
                this.messageEvent.emit(this.data);
              }
            );
         }
        }
        else
        { 
            this.poruka = "Fajl mora biti .csv";
        }
      }
  }

  //F-ja za pretvaranje ulaznog .csv fajla u string
  

}
