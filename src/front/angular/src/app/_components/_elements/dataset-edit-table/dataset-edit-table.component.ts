import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dataset-edit-table',
  templateUrl: './dataset-edit-table.component.html',
  styleUrls: ['./dataset-edit-table.component.scss']
})
export class DatasetEditTableComponent implements OnInit {
  
  constructor() {}
  
  @Output() LoadedEvent = new EventEmitter<null>();
  
  dataset: any;
  columns: string[];
  
  
  // SELECTING PROMS
  public selectedColumns: string[] = [];
  private selectAll: boolean = true;
  
  
  ngOnInit(): void {
    
  }
  
  
  // SELECTING
  
  public SelectDeselectAllColumns(){
    if(this.selectAll)
      this.selectedColumns = this.columns;
    else
      this.selectedColumns = [];
      
    this.selectAll = !this.selectAll;
  }
  
  public SelectDeselectColumn(column: string){
    if(this.selectedColumns.includes(column))
      this.selectedColumns.splice(this.selectedColumns.indexOf(column), 1);
    else
      this.selectedColumns.push(column);
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
  
  public GetRowKeys(row: any){
    return Object.keys(row)
  }
  
}
