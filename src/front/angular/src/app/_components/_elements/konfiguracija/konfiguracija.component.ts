import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataSplitSliderComponent } from '../data-split-slider/data-split-slider.component';


@Component({
  selector: 'app-konfiguracija',
  templateUrl: './konfiguracija.component.html',
  styleUrls: ['./konfiguracija.component.scss']
})
export class KonfiguracijaComponent implements OnInit {
  constructor() { }
  
  @Input() neuralNetwork: any;
  
  @ViewChild("dataSplitSlider")
  dataSplitSlider: DataSplitSliderComponent;
  
  ngOnInit(): void {
    setTimeout(() => {
      this.dataSplitSlider.slider1Position = this.neuralNetwork.conf.trainSplit;
      this.dataSplitSlider.slider2Position = this.neuralNetwork.conf.trainSplit + this.neuralNetwork.conf.valSplit;
      this.dataSplitSlider.UpdateSlider();
    }, 0);
  }
  
  
  public ChangeProblemType(event: any){
    this.neuralNetwork.conf.problemType = event.srcElement.value;
  }
  
  public ChangeLearningRate(event: any){
    this.neuralNetwork.conf.learningRate = Number.parseFloat(event.srcElement.value);
  }
  
  public ChangeReg(event: any){
    this.neuralNetwork.conf.reg = event.srcElement.value;
  }
  
  public ChangeRegRate(event: any){
    this.neuralNetwork.conf.regRate = Number.parseFloat(event.srcElement.value);
  }
  
  public ChangeBatchSize(event: any){
    this.neuralNetwork.conf.batchSize = Number.parseInt(event.srcElement.value);
  }
  
  public ChangeSplitType(event: any){
    this.neuralNetwork.conf.splitType = event.srcElement.value;
    
    if(event.srcElement.value == "random"){
      this.neuralNetwork.conf.trainSplit = Math.floor(Math.random() * 10) / 10;
      this.neuralNetwork.conf.valSplit = 1 - this.neuralNetwork.conf.trainSplit;
      
      this.dataSplitSlider.sliderDisabled = true;
    }
    else
      this.dataSplitSlider.sliderDisabled = false;
    
  }
  
  public ChangeTrainValidationSplit(event: any){
    this.neuralNetwork.conf.trainSplit = event.Train;
    this.neuralNetwork.conf.valSplit = event.Validation;
  }
 
}
