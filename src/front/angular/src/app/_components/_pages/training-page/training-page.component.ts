import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { ChartTrainingComponent } from '../../_elements/chart-training/chart-training.component';
import { KonfiguracijaComponent } from '../../_elements/konfiguracija/konfiguracija.component';

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
    console.log("podaci:"
      + "\n" + this.konfiguracija.learningRate
      + "\n" + this.konfiguracija.regularization
      + "\n" + this.konfiguracija.regularizationRate
      + "\n" + this.konfiguracija.batchSize
      + "\n" + this.konfiguracija.inputs
      + "\n" + this.konfiguracija.outputs
      + "\n" + this.konfiguracija.activation);
      
    let conf: any = {

      inputs: this.konfiguracija.inputs, //str[]
      outputs: this.konfiguracija.outputs, //str[]
      neuronsPerLayer: [3, 3], //int[]
      actOut: 'sigmoid',
      actPerLayer: ['sigmoid', 'sigmoid'], //str[]
      learningRate: this.konfiguracija.learningRate, //float
      reg: this.konfiguracija.regularization, //str
      regRate: this.konfiguracija.regularizationRate, //float
      batchSize: this.konfiguracija.batchSize, //int
      trainSplit: 0.3,
      valSplit: 0.2
    };
    
    console.log('--- KONFIGURACIJA ---')
    console.log(conf)
    this.wsService.train(this.projectId, this.nnId, conf, this, this.addTrainData);
  }

  addTrainData(self: TrainingPageComponent, data: any) {
    let tLoss = data['t_loss'];
    let vLoss = data['v_loss'];
    let ep = data['epoch'];

    self.grafik.dataUpdate(ep, tLoss, vLoss)
  }

}
