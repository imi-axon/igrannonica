import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-opcije-edit-dataset',
  templateUrl: './opcije-edit-dataset.component.html',
  styleUrls: ['./opcije-edit-dataset.component.scss']
})
export class OpcijeEditDatasetComponent implements OnInit {

  constructor() { }

  prikaziEnkodiranje: boolean = false;
  
  
  @Output() RemoveColumnsClicked = new EventEmitter<any>();
  @Output() RemoveNullRowsClicked = new EventEmitter<any>();
  @Output() FillNullRowsClicked = new EventEmitter<any>();
  @Output() RemoveDuplicatesClicked = new EventEmitter<null>();
  @Output() EncodeColumnsOneHotClicked = new EventEmitter<any>();
  @Output() EncodeColumnsLabelClicked = new EventEmitter<any>();
  
  
  ngOnInit(): void {
  }

  public vrsteEnkodiranja() {
    console.log("uso");
    if (this.prikaziEnkodiranje == false)
      this.prikaziEnkodiranje = true;
    else this.prikaziEnkodiranje = false;

    console.log(this.prikaziEnkodiranje);
  }
  
  
  
  public RemoveColumns(){
    this.RemoveColumnsClicked.emit();
  }
  
  public RemoveNullRows(){
    this.RemoveNullRowsClicked.emit();
  }
  
  public FillNullRows(){
    this.FillNullRowsClicked.emit();
  }
  
  public RemoveDuplicates(){
    this.RemoveDuplicatesClicked.emit();
  }
  
  public OneHotEncoding(){
    this.EncodeColumnsOneHotClicked.emit();
  }
  
  public LabelEncoding(){
    this.EncodeColumnsLabelClicked.emit();
  }
  
}
