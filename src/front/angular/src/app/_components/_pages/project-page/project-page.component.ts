import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  private projectId: number;
  private inputs: string[] = ["n1", "n2"];
  private outputs: string[] = ["out"];

  constructor(
    private wsService: TrainingApiService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void 
  {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    let i = this.activatedRoute.snapshot.paramMap.get("Inputs");
    let o = this.activatedRoute.snapshot.paramMap.get("Outputs");
    if (p != null && i != null && o != null) {
      this.projectId = Number.parseInt(p)
      this.inputs = i.split(',')
      this.outputs = o.split(',')
    }
    else {
      this.router.navigateByUrl('/')
    }
  }

  public test() {

    console.log('Pokrecem trening za projekat ' + this.projectId)
    // let conf: any = {inputs:["n1","n2"], outputs:["out"]};
    let conf: any = {inputs: this.inputs, outputs: this.outputs};
    this.wsService.test(this.projectId, conf);
  }

}
