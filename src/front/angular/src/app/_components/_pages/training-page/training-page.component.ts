import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { KonfiguracijaComponent } from '../../_elements/konfiguracija/konfiguracija.component';

@Component({
  selector: 'app-training-page',
  templateUrl: './training-page.component.html',
  styleUrls: ['./training-page.component.scss']
})
export class TrainingPageComponent implements OnInit {

  private projectId: number;
  @ViewChild('konf') konfiguracija: KonfiguracijaComponent;

  constructor(
    private wsService: TrainingApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)
      this.projectId = Number.parseInt(p);
  }

  public treniraj() {
    console.log("pokrecem treniranje projekta" + this.projectId);
    console.log("podaci:" + this.konfiguracija.learningRate + this.konfiguracija.regularization + this.konfiguracija.regularizationRate + this.konfiguracija.batchSize + this.konfiguracija.inputs + this.konfiguracija.outputs);
     let conf: any = {learningRate:this.konfiguracija.learningRate, regularization:this.konfiguracija.regularization, regularizationRate:this.konfiguracija.regularizationRate, batchSize:this.konfiguracija.batchSize, inputs:this.konfiguracija.inputs,outputs:this.konfiguracija.outputs};
     this.wsService.train(this.projectId,conf);
  }
}
