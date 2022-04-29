import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';

@Component({
  selector: 'app-experiment-network',
  templateUrl: './experiment-network.component.html',
  styleUrls: ['./experiment-network.component.scss']
})
export class ExperimentNetworkComponent implements OnInit {
  
  @Input() public project: Project;
  
  private getProjectId(): number{
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      return Number.parseInt(p);
    }
    return -1;
  }
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
