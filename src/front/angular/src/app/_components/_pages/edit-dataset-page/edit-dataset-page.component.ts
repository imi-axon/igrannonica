import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { EditDatasetComponent } from '../../_elements/edit-dataset/edit-dataset.component';

@Component({
  selector: 'app-edit-dataset-page',
  templateUrl: './edit-dataset-page.component.html',
  styleUrls: ['./edit-dataset-page.component.scss']
})
export class EditDatasetPageComponent implements OnInit {
  
  public dataset: any;
  public statistics: any;
  
  public ProjectId: number;
  
  
  // TEST, ZAMENITI KASNIJE
  main: boolean = false;
  
  
  @ViewChild('edit')
  editDataset: EditDatasetComponent;
  
  constructor(private datasetAPI: DatasetService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    setTimeout(() => {
      this.checkProjectId();
    
      this.datasetAPI.GetDataset(this.ProjectId, false, this, this.successfulGetDatasetCallback);
    }, 0);
    
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
  
  
  // CALLBACK ==========================================================================
  
  private successfulGetStatisticsCallback(self: any, response: any){
    self.statistics = JSON.parse(response.statistics);
    self.editDataset.LoadDataAndRowNulls(self.dataset, self.statistics.rownulls);
  }
  
  private successfulGetDatasetCallback(self: any, response: any){
    self.dataset = JSON.parse(response.dataset);
    self.datasetAPI.GetStatistics(self.ProjectId, false, self, self.successfulGetStatisticsCallback);
  }
  
  private successfulEditCallback(self: any){
    self.datasetAPI.GetDataset(self.ProjectId, false, self, self.successfulGetDatasetCallback);
  }
  
  
  
  // KOMANDE  =========================================================================
  
  // IZMENI KOLONU
  public HandleFileChange(event: any){
    let command = [{ action: "put", col: event.col, row: event.row, value: event.value }]
    
    console.log(command);
    
    // Ispod kao novi parametar bi isao callback za gresku gde bi mogli da revert-ujemo vrednost u polju (za to bi morali da posaljemo startu vrednost ovoj f-ji)
    this.datasetAPI.EditDataset(command, this.ProjectId, false, this);
  }
  
  
  // BRISI KOLONE
  public RemoveColumns(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del col');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // BRISI REDOVE SA NULL
  public RemoveNullRows(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'del nullrows');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL KATEGORIJSKI
  public FillNullRowsWithCat(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows cat');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL PROSEKOM
  public FillNullRowsWithMean(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows mean');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // POPUNI REDOVE SA NULL MEDIJANOM
  public FillNullRowsWithMedian(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
    
    let editJSON = this.getActionsJSON(selectedColumns, 'ins nullrows median');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // OBRISI REDOVE DUPLIKATE
  public RemoveDuplicates(selectedColumns: string[]){
    if(selectedColumns.length != 1)
      return;
      
    let editJSON = [{ action: 'del duplicates' }];
    
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // ONEHOT NAD IZABRANIM KOLONAMA
  public OneHotEncoding(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc onehot');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  
  // LABEL NAD IZABRANIM KOLONAMA
  public LabelEncoding(selectedColumns: string[]){
    if(selectedColumns.length <= 0)
      return;
      
    let editJSON = this.getActionsJSON(selectedColumns, 'enc label');
    
    this.datasetAPI.EditDataset(editJSON, this.ProjectId, false, this, this.successfulEditCallback);
  }
  

}
