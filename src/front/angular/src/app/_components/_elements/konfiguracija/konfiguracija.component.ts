import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-konfiguracija',
  templateUrl: './konfiguracija.component.html',
  styleUrls: ['./konfiguracija.component.scss']
})
export class KonfiguracijaComponent implements OnInit {
  constructor() { }
  
  @Input() neuralNetwork: any;
  
  
  ngOnInit(): void {
    
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
      this.neuralNetwork.conf.trainSplit = Math.floor(Math.random()*10) / 10;
      this.neuralNetwork.conf.valSplit = 1 - this.neuralNetwork.conf.trainSplit;
    }
  }
  
  public ChangeTrainValidationSplit(event: any){
    this.neuralNetwork.conf.trainSplit = Number.parseFloat(event.srcElement.value);
    this.neuralNetwork.conf.valSplit = (1 - Number.parseFloat(event.srcElement.value));
  }
  
  
  
  /*
  onChange(event: any) {
    this.selektovano = event.target.value;
    this.idSelektovanog = event.target.id;

    switch (this.idSelektovanog) {
      case "LearningRate":
        this.learningRate = this.selektovano;
        break;
      case "RegularizationRate":
        this.regularizationRate = this.selektovano;
        break;
      case "Regularization":
        this.regularization = this.selektovano;
        break;
      case "batchSlider":
        this.batchSize = Number.parseInt(this.selektovano);
        break;
      case "Activation":
        this.activation = this.selektovano;
        break;
      case "Split":
        this.split = this.selektovano;
        console.log("uso ha");
        if(this.split=='Random')
        this.dataSplit();
        break;
    }
  }

  inputClick(clicked: any) {
    console.log(clicked.target.id);
    console.log(clicked.target.value);
    console.log(clicked.target.checked);

    
    var added = false;
    
    if (clicked.target.checked == true) {
      this.inputs.push(clicked.target.value);
      added = true;
    }
    else {
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i] == clicked.target.value)
          this.inputs.splice(i, 1);
      }
    }

    console.log(this.inputs);
    
    this.inputChanged.emit({inputs:this.inputs, added: added});
  }

  outputClick(clicked: any) {
    console.log(clicked.target.id);
    console.log(clicked.target.value);
    console.log(clicked.target.checked);
    
    var added = false;
    
    if (clicked.target.checked == true) {
      this.outputs.push(clicked.target.value);
      added = true;
    }
    else {
      for (let i = 0; i < this.outputs.length; i++) {
        if (this.outputs[i] == clicked.target.value)
          this.outputs.splice(i, 1);
      }
    }

    console.log(this.outputs);

    this.outputChanged.emit({outputs: this.outputs, added: added});
  }

  public prikaziInput() {
    if (this.prikaziInpute == false) {
      this.prikaziInpute = true;
    }
    else {
      this.prikaziInpute = false;
      this.inputs = [];
    }
  }

  public prikaziOutput() {
    if (this.prikaziOutpute == false) {
      this.prikaziOutpute = true;
    }
    else {
      this.prikaziOutpute = false;
      this.outputs = []
    };
  }

  public potvrdiInp() {
    this.prikaziInpute = false;
    this.slobodneKolone=this.columns.filter((i: string)=>!this.inputs.includes(i));
    // ((element: string)=>{this.inputs.indexOf(element)==-1;});
    console.log(this.slobodneKolone);
    this.gotovoInputi = true;
    this.prikaziOutpute = true;
  }
  public potvrdiOut() {
    this.prikaziOutpute = false;
    this.gotovoOutputi = true;
  }

  dataSplit(){

    this.trainSplit =  (Math.random() * 100)/100
    this.valSplit =(Math.random() * (100-this.trainSplit))/100;
    this.krajSplit=true;
    // this.konfiguracija.testSplit =  (Math.random() * (100- (this.konfiguracija.valSplit+this.konfiguracija.trainSplit))
  }
  */
 
}
