import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'metrics-barplot',
  templateUrl: './metrics-barplot.component.html',
  styleUrls: ['./metrics-barplot.component.scss']
})
export class MetricsBarplotComponent implements OnInit {
  constructor() { }
  
  @Input() public title: string = "";
  @Input() public code: string = "";
  public trainingValue: number = 0;
  public validationValue: number = 0;
  public testValue: number = 0;
  public maxValue: number = 0;
  
  @ViewChild("trainingBarplot")
  trainingBarplot: ElementRef;
  
  @ViewChild("validationBarplot")
  validationBarplot: ElementRef;
  
  @ViewChild("testBarplot")
  testBarplot: ElementRef;
  
  ngOnInit(): void {
    this.ResetBarplot();
  }
  
  public ResetBarplot(){
    this.trainingValue = 0;
    this.validationValue = 0;
    this.testValue = 0;
    this.maxValue = 1;
  }
  
  public UpdateBarplot(trainingValue: number, validationValue: number){
    this.trainingValue = trainingValue;
    this.validationValue = validationValue;
    
    if(trainingValue > validationValue)
      this.maxValue = (this.maxValue + trainingValue) / 2;
    else
      this.maxValue = (this.maxValue + validationValue) / 2;
    
    
    this.trainingBarplot.nativeElement.setAttribute('style', 'width: ' + (this.trainingValue / this.maxValue * 100) + '%');
    this.validationBarplot.nativeElement.setAttribute('style', 'width: ' + (this.validationValue / this.maxValue * 100) + '%');
  }
  
  public FinishBarplot(testValue: number){
    this.testValue = testValue;
    
    if(this.testValue > this.maxValue)
      this.maxValue = this.testValue;
    
    this.trainingBarplot.nativeElement.setAttribute('style', 'width: ' + (this.trainingValue / this.maxValue * 100) + '%');
    this.validationBarplot.nativeElement.setAttribute('style', 'width: ' + (this.validationValue / this.maxValue * 100) + '%');
    this.testBarplot.nativeElement.setAttribute('style', 'width: ' + (this.testValue / this.maxValue * 100) + '%');
  }
  
  

}
