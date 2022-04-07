import { Component, OnInit } from '@angular/core';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  constructor(private wsService: TrainingApiService) { }

  ngOnInit(): void 
  {
    
  }

  public test() {

    let conf: any = {inputs:["n1","n2"], outputs:["out"]};
    this.wsService.test(4, conf);
  }

}
