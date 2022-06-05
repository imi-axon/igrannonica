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

  columnsTop: { span: number, text: string }[] | null = null;
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
  
  public SelectDeselectColumn(column: string, type: string){
    if(type == 'enc')
      return;
    
    if(this.selectedColumns.includes(column))
      this.selectedColumns.splice(this.selectedColumns.indexOf(column), 1);
    else
      this.selectedColumns.push(column);
    
    this.ColumnSelected.emit();
  }
  
  public SelectDeselectMeta(index: number, column: any){
    var columnsToSelect = this.columns.filter(
      (value: string) => {
        if(value.includes(column.text))
          return value;
        return;
      }
    );
    console.log(columnsToSelect)
    
    columnsToSelect.forEach((col) => {
      this.SelectDeselectColumn(col, '')
    })
    /*
    for(let i = index; i < index + column.span; i++)
      this.SelectDeselectColumn(this.columns[i], '');*/
  }
  
  
  
  
  
  // ========================== DATASET =========================== //
  public LoadDataset(dataset: any){
    this.dataset = dataset;
    this.columns = Object.keys(dataset[0]);

    // Kreiranje reda koji stoji iznad Headers reda u tabeli
    this.columnsTop = []
    let span: number = 0
    
    //console.log(this.columns)
    
    var currentHeader = "";
    
    for (const col of this.columns) 
    {
      //console.log('>>> ' + col)
      if (!this.IsColEncOneHot(col)) {
        if (span == 0) {
          this.columnsTop.push({span: 1, text: ''})
          currentHeader = ""
        }
        else {
          this.columnsTop[this.columnsTop.length-1].span = span
          span = 0
          this.columnsTop.push({span: 1, text: ''})
          currentHeader = ""
        }
      }
      else if (this.columnsMeta) {
        
        if(currentHeader != this.columnsMeta[col].encoding?.onehot?.originalHeader){
          this.columnsTop[this.columnsTop.length-1].span = span
          span = 0
          let h = this.columnsMeta[col].encoding?.onehot?.originalHeader
          this.columnsTop.push({span: 1, text: h?h:''})
          currentHeader = this.columnsMeta[col].encoding?.onehot?.originalHeader!;
        }
        else if (span == 0) {
          let h = this.columnsMeta[col].encoding?.onehot?.originalHeader
          this.columnsTop.push({span: 1, text: h?h:''})
          currentHeader = this.columnsMeta[col].encoding?.onehot?.originalHeader!;
        }
        span += 1
      }
    }
    //console.log('>>>>>>>>>><<<<<<<<<')
    if (span > 1) {
      this.columnsTop[this.columnsTop.length-1].span = span
      span = 0
    }
    //-----

    //console.log("[[[[[ ----- ]]]]]]")
    //console.log(this.columnsTop)
    
    //console.log(this.columnsMeta);

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

  public IsColNum(col: string) {
    if (this.columnsMeta == null)
      return false
    let hdr: DatasetHeader = this.columnsMeta[col]
    return hdr.type == "num"
  }
  
  public IsColCat(col: string) {
    if (this.columnsMeta == null)
      return false
    let hdr: DatasetHeader = this.columnsMeta[col]
    return hdr.type == "cat"
  }

  public IsColEnc(col: string) {
    if (this.columnsMeta == null)
      return false
    let hdr: DatasetHeader = this.columnsMeta[col]
    return hdr.type == "enc"
  }

  public IsColEncOneHot(col: string) {
    if (this.columnsMeta == null)
    return false
    let hdr: DatasetHeader = this.columnsMeta[col]
    
    /*
    console.log("================================================")
    console.log(this.columnsMeta[col])
    console.log(hdr.type == "enc" && hdr.encoding?.type == "onehot")*/
    
    return hdr.type == "enc" && hdr.encoding?.type == "onehot"
  }

  public IsColEncLabel(col: string) {
    if (this.columnsMeta == null)
      return false
    let hdr: DatasetHeader = this.columnsMeta[col]
    return hdr.type == "enc" && hdr.encoding?.type == "label"
  }

}
