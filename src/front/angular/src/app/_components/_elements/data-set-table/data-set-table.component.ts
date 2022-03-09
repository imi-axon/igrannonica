import { Component, OnInit } from '@angular/core';
import { DataSetTableService } from 'src/app/_utilities/_services/data-set-table.service';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit {

  public dataJSON : any;
  public keys : any;
  
  
  constructor(private service:DataSetTableService) { 
    console.log(this.dataJSON);
    console.log(this.keys);
    
  }
  
  ngOnInit(): void {
    this.LoadDataSet();
  }
  
  public LoadDataSet() {
    
    this.dataJSON = this.service.GetDataSet();
    this.keys = Object.keys(this.dataJSON[0]);
    
  }
  

}
