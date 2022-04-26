import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'fullscreen-loader',
  templateUrl: './fullscreen-loader.component.html',
  styleUrls: ['./fullscreen-loader.component.scss']
})
export class FullscreenLoaderComponent {

  public isLoading = false;
  
  constructor() { }

}
