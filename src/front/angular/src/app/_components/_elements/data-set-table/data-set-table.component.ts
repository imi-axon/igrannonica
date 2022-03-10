import { Component, Input, OnInit } from '@angular/core';
import { CsvServiceService } from 'src/app/services/csv-service.service';
import { DataSetTableService } from 'src/app/_utilities/_services/data-set-table.service';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit {

  dataJSON: any;
  keys : any;
  
  constructor(private service:CsvServiceService) { 
  }
  
  ngOnInit(): void {
    
  }
  
  public LoadData(event:any){
    
    //console.log(event);
    
    this.dataJSON = event;
    this.keys = Object.keys(this.dataJSON[0]);
  }
  
  
  

}
