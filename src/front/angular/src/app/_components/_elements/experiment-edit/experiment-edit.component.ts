import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
import { CorrelationTableComponent } from '../correlation-table/correlation-table.component';
import { DataSetTableComponent } from '../data-set-table/data-set-table.component';
import { DatasetEditTableComponent } from '../dataset-edit-table/dataset-edit-table.component';
import { PageControlsComponent } from '../page-controls/page-controls.component';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';

const ROW_COUNT = 20

@Component({
  selector: 'app-experiment-edit',
  templateUrl: './experiment-edit.component.html',
  styleUrls: ['./experiment-edit.component.scss']
})
export class ExperimentEditComponent implements OnInit {
  constructor( 
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private statisticsService: StatisticsService
  ) { }
  
  
  // KOMPONENTE ===============================================
  
  @ViewChild("datasetEditTable")
  private datasetEditTable: DatasetEditTableComponent;
  
  @ViewChild("pageControls")
  private pageControls: PageControlsComponent;
  
  @ViewChild("correlationComponent")
  private correlationComponent: CorrelationTableComponent;
  
  @ViewChild("numericalColumns")
  private numericalColumns: StatisticsTableComponent;
  
  @ViewChild("categoricalColumns")
  private categoricalColumns: StatisticsTableComponent;
  
  // KRAJ KOMPONENTI ==========================================
  
  
  private GetProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  ngOnInit(): void {
    this.datasetService.GetDatasetPage(this.GetProjectId(), false, 1, 20, this, this.handleDatasetGetSuccess)
    this.statisticsService.GetStatistics(this.GetProjectId(), false, this, this.handleStatisticsGetSuccess);
  }
  
  
  
  
  
  
  
  
  
  // EDIT OPCIJE ============================================================================================
  
  // LISTA IZABRANIH AKCIJA U JSON
  private getActionsJSON(selectedColumns: string[], selectedAction: string) : any{
    let editJSON = []
    for(let i = 0; i < selectedColumns.length; i++)
      editJSON.push({
          action: selectedAction,
          column: selectedColumns[i]
      });
    return editJSON;
  }
  
  
  
  
  // FILL
  public FillColsWithAverage(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows mean');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  public FillColsWithMedian(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows median');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  public FillColsWithMostCommon(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows cat');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  
  
  // REMOVE
  public RemoveSelectedCols(){
    if(this.datasetEditTable.selectedColumns.length <= 0)
      return;
    
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del col');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  
  public RemoveRowsWithNulls(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del nullrows');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  public RemoveDuplicateRows(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length != 1)
      return;
      
    let editJSON = [{ action: 'del duplicates' }];
    
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  
  
  // ENCODING
  public OneHotEncoding(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc onehot');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  public LabelEncoding(){
    let selectedColumns: string[] = this.datasetEditTable.selectedColumns;
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc label');
    
    this.datasetService.EditDataset(editJSON, this.GetProjectId(), false, this, this.successfulEditCallback);
  }
  
  
  // DOWNLOAD
  public DownloadCurrentChanges(){
    
  }
  
  // AFTER EDIT
  private successfulEditCallback(self: ExperimentEditComponent, response: any){
    self.statisticsService.GetStatistics(self.GetProjectId(), false, self, self.handleStatisticsGetSuccess);
    self.datasetEditTable.DeselectAllSelectedColumns();
    self.ChangeDatasetPage(self.pageControls.currentPage);
  }
  
  
  
  
  // DATASET ================================================================================================
  
  private handleDatasetGetSuccess(self: ExperimentEditComponent, response: any){
    // VRLO GLUPO ALI NE ZNAM ZASTO OVO RADI
    self.datasetEditTable.LoadDataset(JSON.parse(JSON.parse(response.dataset).dataset));
    self.pageControls.SetPageCount(response.pages);
  }
  
  public ChangeDatasetPage(pageNumber: number){
    this.datasetService.GetDatasetPage(this.GetProjectId(), false, pageNumber, ROW_COUNT, this, this.handleDatasetGetSuccess);
  }
  
  // KRAJ DATASETA ==========================================================================================
  
  
  
  
  // STATISTIKA =============================================================================================
  
  private handleStatisticsGetSuccess(self: any, metadata: any){
    let correlationMatrix = self.parseCorrelationData(metadata.statistics.cormat.cols, metadata.statistics.cormat.cors);
    self.correlationComponent.LoadCorrelationData(metadata.statistics.cormat.cols, correlationMatrix);
    
    self.numericalColumns.LoadStatisticsData(metadata.statistics.colstats);
    self.categoricalColumns.LoadStatisticsData(metadata.statistics.categorical_colstats);
    
    console.log(metadata);
  }
  
  
  public parseCorrelationData(columns: string[], cormat: number[]){
    
    let columnsCount = columns.length;
    
    // MATRICA KOJA SADRZI KORELACIONE VREDNOSTI
    let parsedMatrix : number[][] = [];
    
    // POPUNIMO MATRICU JEDINICAMA (POCETNE VREDNOSTI, KASNIJE IH MENJAMO)
    for(let i = 0; i < columnsCount; i++){
      parsedMatrix.push([]);
      for(let j = 0; j < columnsCount; j++)
        parsedMatrix[i].push(1);
    }
    
    let i = 1;
    let j = 0;
    for(let k = 0; k < cormat.length; k++){
      parsedMatrix[i][j] = parsedMatrix[j][i] = cormat[k];
      if(i == ++j){
        i++;
        j = 0;
      }
    }
    
    return parsedMatrix;
  }
  
  // KRAJ STATISTIKE ========================================================================================

}
