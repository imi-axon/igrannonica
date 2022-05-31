import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSplitSliderComponent } from '../data-split-slider/data-split-slider.component';



@Component({
  selector: 'app-konfiguracija',
  templateUrl: './konfiguracija.component.html',
  styleUrls: ['./konfiguracija.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KonfiguracijaComponent implements OnInit, OnChanges {
  constructor() { }
  
  @Input() neuralNetwork: any;
  
  @ViewChild("dataSplitSlider")
  dataSplitSlider: DataSplitSliderComponent;
  
  
  
  @ViewChild("metricsDropdown")
  metricsDropdown: ElementRef;
  @ViewChild("metricsSubmenu")
  metricsSubmenu: ElementRef;
  
  selectedRegressionMetrics: boolean[] = [false, false, false, false, false];
  selectedClassificationMetrics: boolean[] = [false, false, false, false, false, false, false];
  
  selectedRegressionCount: number = 0;
  selectedClassificationCount: number = 0;
  
  possibleRegressionMetrics: string[] = ['mean_squared_error', 'mean_absolute_error', 'root_mean_squared_error', 'mean_absolute_percentage_error', 'mean_squared_logarithmic_error'];
  possibleClassificationMetrics: string[] = ['true_positives', 'false_positives', 'true_negatives', 'false_negatives', 'auc', 'recall', 'precision'];

  neuronOutputNum: number=0;
  
  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.dataSplitSlider.slider1Position = this.neuralNetwork.conf.trainSplit;
      this.dataSplitSlider.slider2Position = this.neuralNetwork.conf.trainSplit + this.neuralNetwork.conf.valSplit;
      this.dataSplitSlider.UpdateSlider();
      
      this.setupMetricSelectMenu();
    }, 0);
  }
  
  
  
  // Klik na polje
  public CheckUncheckRegression(index: number){
    if(this.selectedRegressionMetrics[index]){
      this.selectedRegressionMetrics[index] = false;
      this.selectedRegressionCount--;
    }
    else{
      this.selectedRegressionMetrics[index] = true;
      this.selectedRegressionCount++;
    }
    this.neuralNetwork.conf.metrics = this.selectedMetricsToArray();
  }
  public CheckUncheckClassification(index: number){
    if(this.selectedClassificationMetrics[index]){
      this.selectedClassificationMetrics[index] = false;
      this.selectedClassificationCount--;
    }
    else{
      this.selectedClassificationMetrics[index] = true;
      this.selectedClassificationCount++;
    }
    this.neuralNetwork.conf.metrics = this.selectedMetricsToArray();
  }
  
  // Postavljane pocetnih vrednosti ulaza za izbor metrike
  private setupMetricSelectMenu(){
    this.selectedRegressionCount = 0;
    this.selectedClassificationCount = 0;
    this.selectedRegressionMetrics = [false, false, false, false, false];
    this.selectedClassificationMetrics = [false, false, false, false, false, false, false];
    
    if(this.neuralNetwork.conf.problemType == 'regression'){
      this.selectedRegressionCount = 0;
      for(let i = 0; i < this.possibleRegressionMetrics.length; i++){
        if(this.neuralNetwork.conf.metrics.includes(this.possibleRegressionMetrics[i])){
          this.selectedRegressionMetrics[i] = true;
          this.selectedRegressionCount++;
        }
      }
      
    }
      
    if(this.neuralNetwork.conf.problemType == 'classification'){
      this.selectedClassificationCount = 0;
      for(let i = 0; i < this.possibleClassificationMetrics.length; i++)
        if(this.neuralNetwork.conf.metrics.includes(this.possibleClassificationMetrics[i])){
          this.selectedClassificationMetrics[i] = true;
          this.selectedClassificationCount++;
        }
    }
  }
  
  private selectedMetricsToArray(){
    let selectedMetrics = [];
    if(this.neuralNetwork.conf.problemType == 'regression'){
      for(let i = 0; i < this.selectedRegressionMetrics.length; i++)
        if(this.selectedRegressionMetrics[i])
          selectedMetrics.push(this.possibleRegressionMetrics[i]);
    }
    else if(this.neuralNetwork.conf.problemType == 'classification'){
      for(let i = 0; i < this.selectedClassificationMetrics.length; i++)
        if(this.selectedClassificationMetrics[i])
          selectedMetrics.push(this.possibleClassificationMetrics[i]);
    }
    return selectedMetrics;
  }
  
  // Prikaz sakrivanje izbora metrike
  ChangeMetricsSubmenu(){
    if(this.metricsSubmenu.nativeElement.style.display == 'none' || this.metricsSubmenu.nativeElement.style.display.trim() =='')
      this.OpenMetricsSubmenu();
    else
      this.CloseMetricsSubmenu();
  }
  OpenMetricsSubmenu(){
    setTimeout(() => {
      this.metricsSubmenu.nativeElement.setAttribute("style", "display: block;");
      this.metricsDropdown.nativeElement.focus();
    }, 0);
  }
  CloseMetricsSubmenu(event?: Event){
    this.metricsSubmenu.nativeElement.setAttribute("style", "display: none;");
  }
  
  
  
  
  
  public ChangeProblemType(event: any){
    this.neuralNetwork.conf.problemType = event.srcElement.value;
    this.neuralNetwork.conf.metrics = this.selectedMetricsToArray();
    
    if(event.srcElement.value == 'regression'){
      if(this.neuralNetwork.conf.outputs.length <= 2)
        this.neuralNetwork.conf.loss = 'bce';
      else
        this.neuralNetwork.conf.loss = 'cce';
    }
  }
  
  
  
  
  
  
  
  
  
  
  public ChangeLearningRate(event: any){
    this.neuralNetwork.conf.learningRate = Number.parseFloat(event.srcElement.value);
  }
  public ChangeLossFun(event: any){
    this.neuralNetwork.conf.loss = event.srcElement.value;
  }
  
  public ChangeOptFun(event: any){
    this.neuralNetwork.conf.trainAlg = event.srcElement.value;
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
  }
  
  public ChangeTrainValidationSplit(event: any){
    this.neuralNetwork.conf.trainSplit = event.Train;
    this.neuralNetwork.conf.valSplit = event.Validation;
  }
 
}
