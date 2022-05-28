import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataConverter, DatasetColumnsMeta, DatasetHeader, DatasetMetadata, TopLevelHeaders } from 'src/app/_utilities/_helpers/data-converter';

@Component({
  selector: 'dataset-edit-table',
  templateUrl: './dataset-edit-table.component.html',
  styleUrls: ['./dataset-edit-table.component.scss']
})
export class DatasetEditTableComponent implements OnInit {
  
  constructor() {}
  
  @Output() LoadedEvent = new EventEmitter<null>();
  
  @Output() ColumnSelected = new EventEmitter<null>();
  
  dataset: any;
  columns: string[];

  columnsMeta: DatasetColumnsMeta | null = null;
  topLevelHeaders: TopLevelHeaders | null = null;
  
  
  // SELECTING PROMS
  public selectedColumns: string[] = [];
  private selectAll: boolean = true;
  
  
  ngOnInit(): void {
    
  }
  
  
  // SELECTING
  public DeselectAllSelectedColumns(){
    this.selectedColumns = [];
    this.ColumnSelected.emit();
  }
  
  public SelectDeselectAllColumns(){
    if(this.selectAll)
      this.selectedColumns = this.columns;
    else
      this.DeselectAllSelectedColumns();
      
    this.selectAll = !this.selectAll;
    this.ColumnSelected.emit();
  }
  
  public SelectDeselectColumn(column: string){
    if(this.selectedColumns.includes(column))
      this.selectedColumns.splice(this.selectedColumns.indexOf(column), 1);
    else
      this.selectedColumns.push(column);
    
    console.log(this.selectedColumns)
    this.ColumnSelected.emit();
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

   // ========================== METADATA =========================== //
  public LoadMetadata(meta: DatasetMetadata){
    this.columnsMeta = meta.columns;
    this.topLevelHeaders = DataConverter.metaToHeaders(meta);
    this.LoadedEvent.emit();
  }

  // ---- Provera tipa kolone ---- //

  public IsColNum(hdr: DatasetHeader) {
    return hdr.type == "num"
  }
  
  public IsColCat(hdr: DatasetHeader) {
    return hdr.type == "cat"
  }

  public IsColEncOneHot(hdr: DatasetHeader) {
    return hdr.type == "enc" && hdr.encoding?.type == "onehot"
  }

  public IsColEncLabel(hdr: DatasetHeader) {
    return hdr.type == "enc" && hdr.encoding?.type == "label"
  }

}
