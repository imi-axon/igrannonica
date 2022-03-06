import { Target } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.scss']
})
export class CsvComponent implements OnInit {

  public poruka:string="";
  public csv : string="";

  constructor() { }

  ngOnInit(): void {
  }
  
  

  //F-ja za pretvaranje ulaznog .csv fajla u string
  public changeListener(event: Event){
    this.poruka="";
    console.log(event);
    const target = event.target as HTMLInputElement;
    const file:File = (target.files as FileList)[0];

    if(file) {
         console.log(file.name);
         console.log(file.size);
         console.log(file.type);

      //Provera da li je fajl .csv
      if(file.type=="text/csv"){
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            this.csv = reader.result as string;
            console.log(this.csv);
            
         }
        }
        else
        { 
            this.poruka = "Fajl mora biti .csv";
        }
      }
  }

}
