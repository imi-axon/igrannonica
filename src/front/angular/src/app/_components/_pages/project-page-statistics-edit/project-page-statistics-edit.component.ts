import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { CorrelationTableComponent } from '../../_elements/correlation-table/correlation-table.component';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { DataSetTableComponent } from '../../_elements/data-set-table/data-set-table.component';
import { ActivatedRoute } from '@angular/router';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
@Component({
  selector: 'app-project-page-statistics-edit',
  templateUrl: './project-page-statistics-edit.component.html',
  styleUrls: ['./project-page-statistics-edit.component.scss']
})
export class ProjectPageStatisticsEditComponent implements OnInit {

  constructor(public projectsService: ProjectsService, private datasetService: DatasetService, private activatedRoute: ActivatedRoute,
    public statisticsService:StatisticsService) { }

  projectid: number = 0
  projectMain: boolean = true
  public visible: boolean = false;


  @Output() onBind: boolean = false;

  ngOnInit(): void {

    let proj = this.activatedRoute.snapshot.paramMap.get('ProjectId')
    if (proj != null)
      this.projectid = Number.parseInt(proj);

    console.log('>>>>>>>>> PARAMETAR:' + this.projectid)

    this.LoadDataFromAPI();
  }

  // DATASET
  public LoadDataFromAPI() {
    this.datasetService.GetDataset(this.projectid, true, this, this.handleDataSuccessfulLoad, this.handleDataNotLoggedIn, this.handleDataForbidden, this.handleDataNotFound);

  }

  public handleDataNotLoggedIn(self: any, message: string) {

  }

  public handleDataForbidden(self: any, message: string) {

  }

  public handleDataNotFound(self: any, message: string) {

  }

  public handleDataSuccessfulLoad(self: any, data: any) {
    console.log(data);
    self.dataset = JSON.parse(data.dataset);
    console.log(self.dataset)
    console.log("uspeh dataset")
    self.LoadStatisticsFromAPI();
  }

  // STATISTIKA
  public LoadStatisticsFromAPI() {
    console.log('Load Statistics From API')
    this.datasetService.GetStatistics(this.projectid, this.projectMain, this, this.handleStatisticsSuccessfulLoad, this.handleStatisticsUnauthorized, this.handleStatisticsForbidden, this.handleStatisticsNotFound);
  }

  public handleStatisticsSuccessfulLoad(self: any, statisticsSet: any) {
    console.log('HANDLER')
    console.log(statisticsSet)

    self.statisticsSet = JSON.parse(statisticsSet.statistics);
    console.log(self.statisticsSet);

    self.correlation = self.statisticsSet.cormat;
    self.statistics = self.statisticsSet.colstats;
    console.log(self.statistics);
    self.rowNulls = self.statisticsSet.rownulls;

    self.statisticsService.ParseCorrelationData(self.correlation);
    self.statisticsService.LoadDataAndStatistics(self.dataset,self.statistics,self.rowNulls);

    console.log("zavrseno");
    self.visible = true;
  }

  public handleStatisticsUnauthorized(self: any, message: string) {
  }

  public handleStatisticsForbidden(self: any, message: string) {

  }

  public handleStatisticsNotFound(self: any, message: string) {

  }

}
