import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-opcije-edit-dataset',
  templateUrl: './opcije-edit-dataset.component.html',
  styleUrls: ['./opcije-edit-dataset.component.scss']
})
export class OpcijeEditDatasetComponent implements OnInit {

  constructor() { }

  prikaziEnkodiranje: boolean = false;
  prikaziPopunjavanje: boolean = false;
  
  @Output() RemoveColumnsClicked = new EventEmitter<any>();
  @Output() RemoveNullRowsClicked = new EventEmitter<any>();
  @Output() FillNullRowsCatClicked = new EventEmitter<any>();
  @Output() FillNullRowsAverageClicked = new EventEmitter<any>();
  @Output() FillNullRowsMedianClicked = new EventEmitter<any>();
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
  
  public VrstePopunjavanja() {
    this.prikaziPopunjavanje = !this.prikaziPopunjavanje;
  }
  
  
  public RemoveColumns(){
    this.RemoveColumnsClicked.emit();
  }
  
  public RemoveNullRows(){
    this.RemoveNullRowsClicked.emit();
  }
  
  public FillNullRowsCat(){
    this.FillNullRowsCatClicked.emit();
  }
  public FillNullRowsAverage(){
    this.FillNullRowsAverageClicked.emit();
  }
  public FillNullRowsMedian(){
    this.FillNullRowsMedianClicked.emit();
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
