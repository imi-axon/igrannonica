import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { CorrelationTableComponent } from '../../_elements/correlation-table/correlation-table.component';
import { DataSetTableComponent } from '../../_elements/data-set-table/data-set-table.component';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit{
  
  testJSON:any = JSON.parse('[{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"},{"col1":"test","col2":"test","col3":"test","col4":"test","col5":"test","col6":"test","col7":"test","col8":"test","col9":"test","col10":"test","col11":"test","col12":"test","col13":"test","col14":"test","col15":"test"}]');
  
  // Test statisticki podaci
  testCorrelation: any = JSON.parse('{"cormat":{"cols":["Kolona1","Kolona2","Kolona3","Kolona4","Kolona5"],"cors":[0.533,0.644,0,0,0.751,1,0,0.151,0.253,0.26]},"colstats":[{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0},{"col":"Kolona1","min":0.6,"max":1.85,"avg":1.2,"med":1,"nul":0},{"col":"Kolona2","min":0.3,"max":3.25,"avg":1.98,"med":1.56,"nul":1},{"col":"Kolona3","min":1.6,"max":2.15,"avg":3.67,"med":1.23,"nul":0},{"col":"Kolona4","min":3.23,"max":6.42,"avg":2.41,"med":4.2,"nul":2},{"col":"Kolona5","min":1.72,"max":4.88,"avg":3.2,"med":2,"nul":0}],"rownulls":[0,1,0,1,1,0,0,2,2,0,1,2,0,2,2,3,3,2,1,2,2,2,0,1,0,0,2,1,2,3,1,0,2,2,1,3,0,1,2,0,0,0,1,3,1,2,1,0,1,0]}');
  
  test_project_id: number = 1;
  test_main_boolean: boolean = false;
  
  projectid: number = 0
  projectMain: boolean = true

  public statisticsSet: any;
  public dataset: any;
  public correlation: any;
  public statistics: any;
  public rowNulls: any;
  
  
  @ViewChild('datasetComponent') datasetComponent: DataSetTableComponent;
  @ViewChild('corr') correlationComponent: CorrelationTableComponent;
  
  // Ovoj promenljivoj ne menjamo vrednost
  @Output() onBind: boolean = false;
  public correlationView: boolean = false;
  
  public visible: boolean = false;
  
  constructor(
    private datasetService: DatasetService,
    private activatedRoute: ActivatedRoute
  ) { }
  

  ngOnInit(): void {
    let proj = this.activatedRoute.snapshot.paramMap.get('ProjectId')
    if (proj != null)
      this.projectid = Number.parseInt(proj);
    
    console.log('>>>>>>>>> PARAMETAR:' + this.projectid)

    this.LoadDataFromAPI();
  }
  
  switchTableView(){
    this.correlationView = !this.correlationView;
  }
  
  
  // Za testiranje ===============================
  
  public LoadTestData(){
    
    // Simulacija cekanja na podatke (2 sekunde)
    setTimeout(() => {
      this.dataset = this.testJSON;
      this.correlation = this.testCorrelation.cormat;
      this.statistics = this.testCorrelation.colstats;
      this.rowNulls = this.testCorrelation.rownulls;
    
      this.datasetComponent.LoadDataAndStatistics(this.dataset, this.statistics, this.rowNulls);
      this.correlationComponent.ParseCorrelationData(this.correlation);
      this.visible = true;
    }, 2000);
  }
  
  
  // U stvarnosti ===============================
  
  // DATASET
  public LoadDataFromAPI(){
    this.datasetService.GetDataset(this.projectid, this, this.handleDataSuccessfulLoad, this.handleDataNotLoggedIn, this.handleDataForbidden, this.handleDataNotFound);
    
  }
  
  public handleDataNotLoggedIn(self:any, message: string){
    
  }
  
  public handleDataForbidden(self:any, message: string){
    
  }
  
  public handleDataNotFound(self:any, message: string){
    
  }
  
  public handleDataSuccessfulLoad(self:any, data: any){
    self.dataset = JSON.parse(data.dataset);
    console.log(self.dataset)
    
    self.LoadStatisticsFromAPI();
  }
  
  // STATISTIKA
  public LoadStatisticsFromAPI(){
    console.log('Load Statistics From API')
    this.datasetService.GetStatistics(this.projectid, this.projectMain, this, this.handleStatisticsSuccessfulLoad, this.handleStatisticsUnauthorized, this.handleStatisticsForbidden, this.handleStatisticsNotFound);
  }
  
  public handleStatisticsSuccessfulLoad(self:any, statisticsSet: any){
    console.log('HANDLER')
    console.log(statisticsSet)
    self.statisticsSet = JSON.parse(statisticsSet.statistics);
    console.log(self.statisticsSet)
    
    self.correlation = self.statisticsSet.cormat;
    self.statistics = self.statisticsSet.colstats;
    self.rowNulls = self.statisticsSet.rownulls;
    
    self.datasetComponent.LoadDataAndStatistics(self.dataset, self.statistics, self.rowNulls);
    self.correlationComponent.ParseCorrelationData(self.correlation);
    
    self.visible = true;
  }
  
  public handleStatisticsUnauthorized(self:any, message: string){
  }
  
  public handleStatisticsForbidden(self:any, message: string){
    
  }
  
  public handleStatisticsNotFound(self:any, message: string){
    
  }
  
  
  
}
