import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';

@Component({
  selector: 'app-konfiguracija',
  templateUrl: './konfiguracija.component.html',
  styleUrls: ['./konfiguracija.component.scss']
})
export class KonfiguracijaComponent implements OnInit {

  constructor(private datasetService: DatasetService, private activatedRoute: ActivatedRoute) { }

  private learningRate: number;
  private regularization: string;
  private regularizationRate: number;
  private epoch: number;
  private selektovano: any;
  private idSelektovanog: any;
  public batchSize: number = 15;
  private projectID: any;
  public dataset: any;
  public columns: any = [];
  public inputs: string[];
  public outputs: string[];
  public prikaziInpute = false;
  public prikaziOutpute = false;
  public gotovoInputi = false;
  public gotovoOutputi = false;

  ngOnInit(): void {
    this.projectID = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    this.inputs = [];
    this.outputs = [];

    //ZAMENITI F-JOM KOJA DOVLACI SAMO KOLONE
    this.datasetService.GetDataset(this.projectID, true, this, this.successCallback);

  }

  successCallback(self: any, data: any) {
    console.log(data);
    self.dataset = JSON.parse(data.dataset);
    self.columns = Object.keys(self.dataset[0]);
    console.log(self.dataset);
    console.log(self.columns);
  }

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
        this.batchSize = this.selektovano;
        break;
    }
  }

  inputClick(clicked: any) {
    console.log(clicked.target.id);
    console.log(clicked.target.value);
    console.log(clicked.target.checked);


    if (clicked.target.checked == true) {
      this.inputs.push(clicked.target.value);
    }
    else {
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i] == clicked.target.value)
          this.inputs.splice(i, 1);
      }
    }

    console.log(this.inputs);

  }

  outputClick(clicked: any) {
    console.log(clicked.target.id);
    console.log(clicked.target.value);
    console.log(clicked.target.checked);

    if (clicked.target.checked == true) {
      this.outputs.push(clicked.target.value);

    }
    else {
      for (let i = 0; i < this.outputs.length; i++) {
        if (this.outputs[i] == clicked.target.value)
          this.outputs.splice(i, 1);
      }
    }

    console.log(this.outputs);

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

  // public prikaziInput(){
  //   if(this.prikaziInpute==false) {
  //     if(this.prikaziOutpute==true) this.prikaziOutpute=false;
  //     this.prikaziInpute=true;
  //   }
  //   else this.prikaziInpute=false;
  // }

  // public prikaziOutput(){
  //   if(this.prikaziOutpute==false){
  //     if(this.prikaziInpute==true) this.prikaziInpute=false;
  //     this.prikaziOutpute=true;}
  //   else this.prikaziOutpute=false;
  // }

  public potvrdiInp() {
    this.prikaziInpute = false;
    this.gotovoInputi = true;
    this.prikaziOutpute = true;
  }
  public potvrdiOut() {
    this.prikaziOutpute = false;
    this.gotovoOutputi = true;
  }

}
