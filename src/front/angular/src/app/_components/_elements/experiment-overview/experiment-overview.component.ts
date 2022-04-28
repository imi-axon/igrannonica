import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { DataSetTableComponent } from '../data-set-table/data-set-table.component';
import { PageControlsComponent } from '../page-controls/page-controls.component';

const ROW_COUNT = 20;

@Component({
  selector: 'app-experiment-overview',
  templateUrl: './experiment-overview.component.html',
  styleUrls: ['./experiment-overview.component.scss']
})
export class ExperimentOverviewComponent implements OnInit{
  
  @Input() public project: Project;
  
  private getProjectId(): number{
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      return Number.parseInt(p);
    }
    return -1;
  }
  
  @ViewChild("dataset")
  public datasetComponent: DataSetTableComponent;
  @ViewChild("pageControls")
  public controlsComponent: PageControlsComponent; 
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService
  ) { }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.ChangeDatasetPage(1);
      this.controlsComponent.currentPage = 1;
    }, 0);
  }
  
  private datasetPageRecieved(self: ExperimentOverviewComponent, response: any){
    // VRLO GLUPO ALI NE ZNAM ZASTO OVO RADI
    self.datasetComponent.LoadDataset(JSON.parse(JSON.parse(response.dataset).dataset));
    self.controlsComponent.SetPageCount(response.pages);
  }
  
  public ChangeDatasetPage(pageNumber: number){
    this.datasetService.GetDatasetPage(this.getProjectId(), true, pageNumber, ROW_COUNT, this, this.datasetPageRecieved);
  }

}
