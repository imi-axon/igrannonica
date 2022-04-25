import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'list-controls',
  templateUrl: './list-controls.component.html',
  styleUrls: ['./list-controls.component.scss']
})
export class ListControlsComponent implements OnInit {
  
  @Output() OnSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() OnOrderBy: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
    
  }
  
  public SearchChanged(event: any){
    this.OnSearch.emit(event.srcElement.value);
  }
  
  public SortSelected(selection: any){
    this.OnOrderBy.emit(selection.srcElement.value);
  }
  
  

}
