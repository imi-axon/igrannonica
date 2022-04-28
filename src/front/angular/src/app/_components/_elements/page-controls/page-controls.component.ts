import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'page-controls',
  templateUrl: './page-controls.component.html',
  styleUrls: ['./page-controls.component.scss']
})
export class PageControlsComponent implements OnInit {
  
  @Output() ChangePageEvent: EventEmitter<number> = new EventEmitter<number>();
  
  public currentPage: number = 0;
  public pageCount: number = 0;
  public pageInput: number;
  
  
  
  
  constructor() { }

  ngOnInit(): void {
  }
  
  public SetPageCount(pageCount: number){
    this.pageCount = pageCount;
  }
  
  public PreviousPage(){
    if(this.currentPage <= 1)
      return;
    this.currentPage--;
    this.ChangePageEvent.emit(this.currentPage);
  }
  
  public NextPage(){
    if(this.currentPage > this.pageCount)
      return;
    this.currentPage++;
    this.ChangePageEvent.emit(this.currentPage);
  }
  
  public MinPage(){
    this.currentPage = 1;
    this.ChangePageEvent.emit(this.currentPage);
  }
  
  public MaxPage(){
    this.currentPage = this.pageCount;
    this.ChangePageEvent.emit(this.currentPage);
  }
  
  public GoToPage(){
    if(this.pageInput == null 
      || this.pageInput <= 0 
      || this.pageInput > this.pageCount)
      return;
      
    this.currentPage = this.pageInput;
    this.ChangePageEvent.emit(this.currentPage);
  }

}
