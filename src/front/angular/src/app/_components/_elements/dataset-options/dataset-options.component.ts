import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dataset-options',
  templateUrl: './dataset-options.component.html',
  styleUrls: ['./dataset-options.component.scss']
})
export class DatasetOptionsComponent implements OnInit {

  @Output() SaveClicked = new EventEmitter<any>();
  @Output() DiscardClicked = new EventEmitter<any>();
  @Output() DownloadClicked = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }
  
  public Save(){
    this.SaveClicked.emit();
  }
  
  public Discard(){
    this.DiscardClicked.emit();
  }
  
  public Download(){
    this.DownloadClicked.emit();
  }

}
