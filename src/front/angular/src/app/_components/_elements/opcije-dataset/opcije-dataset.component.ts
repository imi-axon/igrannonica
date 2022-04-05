import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';



@Component({
  selector: 'app-opcije-dataset',
  templateUrl: './opcije-dataset.component.html',
  styleUrls: ['./opcije-dataset.component.scss']
})
export class OpcijeDatasetComponent implements OnInit {
  public ProjectId:number;

  constructor(public activatedRoute: ActivatedRoute,private router:Router,public projectsService:ProjectsService) { }

  ngOnInit(): void {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) this.ProjectId = p as unknown as number;
  }

  onClickStatistics(){
    this.projectsService.edit=false;
    this.router.navigate(['statistics'],{relativeTo:this.activatedRoute});
    console.log(this.projectsService.edit);
  }

  onClickEdit(){
    this.projectsService.edit=true;
    this.router.navigate(['edit'],{relativeTo:this.activatedRoute});
    console.log(this.projectsService.edit);
  }


}
