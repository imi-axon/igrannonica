import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { EditDatasetComponent } from '../../_elements/edit-dataset/edit-dataset.component';

@Component({
  selector: 'app-project-page-statistics-edit',
  templateUrl: './project-page-statistics-edit.component.html',
  styleUrls: ['./project-page-statistics-edit.component.scss']
})
export class ProjectPageStatisticsEditComponent implements OnInit {
  public ProjectId: number;

  public showsEditOptions: boolean;
  public dataset: any;
  public statistics: any;
  
  
  // TEST, ZAMENITI KASNIJE
  main: boolean = false;
  
  editComponent: EditDatasetComponent;
  
  constructor(private datasetAPI: DatasetService, public activatedRoute: ActivatedRoute, public projectsService: ProjectsService) { }


  ngOnInit(): void {
    
    setTimeout(() => {
      this.checkProjectId();
    
      this.datasetAPI.GetDataset(this.ProjectId, false, this, this.successfulGetDatasetCallback);
    }, 0);
    
  }
  
  public OnActivate(component: any){
    if(!(component instanceof EditDatasetComponent)){
      this.showsEditOptions = false;
      return;
    }
    this.editComponent = component;
    
    this.editComponent.ChangedField.subscribe( change => this.HandleFieldChange(change) );
      this.editComponent.DataUpdateNeeded.subscribe( event => this.UpdateData() );
      this.editComponent.SaveDataNeeded.subscribe( event =>this.SaveData() );
      
      this.showsEditOptions = true;
  }
  
  
  
  
  // UZIMAMAMO projectId
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) 
      this.ProjectId = p as unknown as number;
  }
  
  
  // PRAVIMO LISTU AKCIJA ZA SVE IZABRANE KOLONE
  private getActionsJSON(selectedColumns: string[], selectedAction: string) : any{
    let editJSON = []
    for(let i = 0; i < selectedColumns.length; i++)
      editJSON.push({
          action: selectedAction,
          column: selectedColumns[i]
      });
    return editJSON;
  }
  
  
  // PONOVO KUPIMO PODATKE
  public UpdateData(){
    this.datasetAPI.GetDataset(this.ProjectId, true, this, this.successfulGetDatasetCallback);
  }
  
  // CUVAMO TRENUTNU IZMENU KAO TRAJNU
  public SaveData(){
    this.datasetAPI.SaveDataset(this.ProjectId);
  }
  
  // CALLBACK ==========================================================================
  
  private successfulGetStatisticsCallback(self: any, response: any){
    self.statistics = JSON.parse(response.statistics);
  }
  
  private successfulGetDatasetCallback(self: any, response: any){
    self.dataset = JSON.parse(response.dataset);
    self.datasetAPI.GetStatistics(self.ProjectId, false, self, self.successfulGetStatisticsCallback);
    self.editDataset.LoadDataAndRowNulls(self.dataset, self.statistics.rownulls);
  }
  
  private successfulEditCallback(self: any){
    self.datasetAPI.GetDataset(self.ProjectId, false, self, self.successfulGetDatasetCallback);
  }
  
  
  
  // KOMANDE  =========================================================================
  
  // IZMENI KOLONU
  public HandleFieldChange(event: any){
    let command = [{ action: "put", col: event.col, row: event.row, value: event.value }]
    
    console.log(command);
    
    // Ispod kao novi parametar bi isao callback za gresku gde bi mogli da revert-ujemo vrednost u polju (za to bi morali da posaljemo startu vrednost ovoj f-ji)
    this.datasetAPI.EditDataset(command, this.ProjectId, false, this);
  }
  
  // BRISI KOLONE
  public RemoveColumns(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del col');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // BRISI REDOVE SA NULL
  public RemoveNullRows(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del nullrows');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL KATEGORIJSKI
  public FillNullRowsWithCat(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows cat');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL PROSEKOM
  public FillNullRowsWithMean(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows mean');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL MEDIJANOM
  public FillNullRowsWithMedian(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows median');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // OBRISI REDOVE DUPLIKATE
  public RemoveDuplicates(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length != 1)
      return;
      
    let editJSON = [{ action: 'del duplicates' }];
    
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // ONEHOT NAD IZABRANIM KOLONAMA
  public OneHotEncoding(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc onehot');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // LABEL NAD IZABRANIM KOLONAMA
  public LabelEncoding(){
    let selectedColumns: string[] = this.editComponent.GetSelectedColumns();
    
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc label');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }

}

