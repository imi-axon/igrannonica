import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-opcije-dataset',
  templateUrl: './opcije-dataset.component.html',
  styleUrls: ['./opcije-dataset.component.scss']
})
export class OpcijeDatasetComponent implements OnInit {
  public ProjectId:number;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) this.ProjectId = p as unknown as number;
  }


}
