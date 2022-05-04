import { Component, OnChanges, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'data-set-table',
  templateUrl: './data-set-table.component.html',
  styleUrls: ['./data-set-table.component.scss']
})
export class DataSetTableComponent implements OnInit, OnChanges{
  
  @Output() LoadedEvent = new EventEmitter<null>();
  
  dataset: any;
  columns: string[];
  
  
  
  ngOnInit(): void {
    
  }

  
  constructor() {}
  
  ngOnChanges(): void {
    
  }
  
  // ========================== DATASET =========================== //
  public LoadDataset(dataset: any){
    this.dataset = dataset;
    this.columns = Object.keys(dataset[0]);
    this.LoadedEvent.emit();
  }
  
  public GetRowData(row: any){
    return Object.values(row)
  }

  
}
