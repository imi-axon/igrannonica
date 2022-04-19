import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { ChartTrainingComponent } from '../../_elements/chart-training/chart-training.component';
import { KonfiguracijaComponent } from '../../_elements/konfiguracija/konfiguracija.component';
import { NeuralNetworkDisplayComponent } from '../../_elements/neural-network-display/neural-network-display.component';

@Component({
  selector: 'app-training-page',
  templateUrl: './training-page.component.html',
  styleUrls: ['./training-page.component.scss']
})
export class TrainingPageComponent implements OnInit {

  private projectId: number;
  private nnId: number;
  @ViewChild('konf') konfiguracija: KonfiguracijaComponent;
  @ViewChild('grafik') grafik: ChartTrainingComponent;
  @ViewChild('nnDisplay') nnDisplay: NeuralNetworkDisplayComponent;

  constructor(
    private wsService: TrainingApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    let n = this.activatedRoute.snapshot.paramMap.get("NNId");
    if (p != null && n != null) {
      this.projectId = Number.parseInt(p);
      this.nnId = Number.parseInt(n);
    }

  }

  public treniraj() {


    console.log("pokrecem treniranje projekta" + this.projectId);
    
    let neuronsPerLayer : number [] = [];
    for(let i = 0; i < this.nnDisplay.network.layers.length - 1; i++)
      neuronsPerLayer.push(this.nnDisplay.network.layers[i].neurons.length)
    
    console.log(neuronsPerLayer)
      
    console.log("podaci:"
      + "\n" + this.konfiguracija.learningRate
      + "\n" + this.konfiguracija.regularization
      + "\n" + this.konfiguracija.regularizationRate
      + "\n" + this.konfiguracija.batchSize
      + "\n" + this.konfiguracija.inputs
      + "\n" + this.konfiguracija.outputs
      
      // Dodato
      + "\n" + neuronsPerLayer
      
      + "\n" + this.konfiguracija.activation);
      
    let conf = {
      inputs: this.konfiguracija.inputs, //str[]
      outputs: this.konfiguracija.outputs, //str[]
      
      // Dodato
      neuronsPerLayer: neuronsPerLayer, //int[]
      
      actPerLayer: ['sigmoid', 'sigmoid'], //str[]
      
      // Dodato
      actOut: "", //str
      
      learningRate: this.konfiguracija.learningRate, //float
      reg: this.konfiguracija.regularization, //str
      regRate: this.konfiguracija.regularizationRate, //float
      batchSize: this.konfiguracija.batchSize //int
      
      // Dodato
      ,
      trainSplit:this.konfiguracija.trainSplit,
      valSplit:this.konfiguracija.valSplit,
      testSplit:this.konfiguracija.testSplit
     // trainSplit: 0.5, // float
     // valSplit: 0.5 // float
    };
    
    console.log('--- KONFIGURACIJA ---')
    console.log(conf)
    this.wsService.train(this.projectId, this.nnId, conf, this, this.addTrainData);

    console.log(this.konfiguracija.valSplit);

  }

  addTrainData(self: TrainingPageComponent, data: any) {
    let tLoss = data['t_loss'];
    let vLoss = data['v_loss'];
    let ep = data['epoch'];

    self.grafik.dataUpdate(ep, tLoss, vLoss)
    self.konfiguracija.epoch=ep;
  }

}
