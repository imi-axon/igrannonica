import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'data-split-slider',
  templateUrl: './data-split-slider.component.html',
  styleUrls: ['./data-split-slider.component.scss']
})
export class DataSplitSliderComponent implements OnInit {

  constructor() { }
  
  @Output() OnChange: EventEmitter<any> = new EventEmitter<any>();
  
  
  
  @ViewChild("container")
  container: ElementRef;
  
  
  // SECTION TITLES
  
  @ViewChild("trainText")
  trainText: ElementRef;
  
  @ViewChild("validationText")
  validationText: ElementRef;
  
  @ViewChild("testText")
  testText: ElementRef;
  
  // SECTIONS
  
  @ViewChild("trainSection")
  trainSection: ElementRef;
  
  @ViewChild("validationSection")
  validationSection: ElementRef;
  
  @ViewChild("testSection")
  testSection: ElementRef;
  
  
  
  // SLIDERS
  
  @ViewChild("slider1")
  slider1: ElementRef;
  
  @ViewChild("slider2")
  slider2: ElementRef;
  
  
  public slider1Position = 0.3;
  public slider2Position = 0.6;
  
  
  public sliderDisabled = false;
  
  public draggingSlider1 = false;
  public draggingSlider2 = false;
  
  
  private subscription: Subscription;
  
  ngOnInit(): void {
    this.subscription = fromEvent(document, 'mouseup').subscribe(
      e => {
        this.EndDraggingSliders(e as MouseEvent);
    });
  }
  
  public UpdateSlider(){
    // SECTIONS
    this.trainSection.nativeElement.setAttribute('style', 'width: ' + (this.slider1Position * 100) + '%');
    this.validationSection.nativeElement.setAttribute('style', 'width: ' + ((this.slider2Position - this.slider1Position) * 100) + '%');
    this.testSection.nativeElement.setAttribute('style', 'width: ' + ((1 - this.slider2Position) * 100) + '%');
    
    // TITLES
    this.trainText.nativeElement.setAttribute('style', 'left: calc(' + (this.slider1Position * 100 * 0.5) + '% - ' + (this.trainText.nativeElement.clientWidth / 2) + 'px)');
    this.validationText.nativeElement.setAttribute('style', 'left: calc(' + ((this.slider1Position + this.slider2Position) * 100 * 0.5) + '% - ' + (this.validationText.nativeElement.clientWidth / 2) + 'px)');
    this.testText.nativeElement.setAttribute('style', 'left: calc(' + (( this.slider2Position + (1 - this.slider2Position) * 0.5) * 100) + '% - ' + (this.testText.nativeElement.clientWidth / 2) + 'px)');
    
    // SLIDERS
    this.slider1.nativeElement.setAttribute('style', 'left: ' + (this.slider1Position * 100) + '%');
    this.slider2.nativeElement.setAttribute('style', 'left: ' + (this.slider2Position * 100) + '%');
  }
  
  
  
  // SLIDER 1
  public StartDraggingSlider1(event: MouseEvent){
    window?.getSelection()?.removeAllRanges();
    document.getSelection()?.empty();
    this.draggingSlider1 = true;
    document.body.setAttribute('style', 'cursor: ew-resize');
  }
  
  // SLIDER 2
  public StartDraggingSlider2(event: MouseEvent){
    window?.getSelection()?.removeAllRanges();
    document.getSelection()?.empty();
    this.draggingSlider2 = true;
    document.body.setAttribute('style', 'cursor: ew-resize');
  }
  
  // END DRAGGING
  public EndDraggingSliders(event: MouseEvent){
    if(!this.draggingSlider1 && !this.draggingSlider2)
      return;
      
    this.draggingSlider1 = false;
    this.draggingSlider2 = false;
    document.body.setAttribute('style', 'cursor: default');
    
    this.OnChange.emit({ 
        "Train": this.slider1Position, 
        "Validation": (Math.round((this.slider2Position - this.slider1Position) * 10) / 10) 
      });
  }
  
  // DRAGGING
  public DraggingSlider(event: MouseEvent){
    if(this.sliderDisabled)
      return;
    
    let currentPosition = event.clientX - this.container.nativeElement.getBoundingClientRect().left;
    let currentIncrement = Math.round( (currentPosition / this.container.nativeElement.clientWidth) * 10) / 10;
    
    if(this.draggingSlider1)
      if(currentIncrement >= 0.1 && currentIncrement < this.slider2Position)
        this.slider1Position = currentIncrement;
    
    if(this.draggingSlider2)
      if(currentIncrement > this.slider1Position && currentIncrement <= 0.9)
        this.slider2Position = currentIncrement;
    
    this.UpdateSlider();
  }

}
