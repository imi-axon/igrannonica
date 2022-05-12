import { Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwnerInfo, Project } from 'src/app/_utilities/_data-types/models';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { EventEmitter } from '@angular/core';
import { DataSetTableComponent } from '../data-set-table/data-set-table.component';
import { PageControlsComponent } from '../page-controls/page-controls.component';

const ROW_COUNT = 20;

@Component({
  selector: 'app-experiment-overview',
  templateUrl: './experiment-overview.component.html',
  styleUrls: ['./experiment-overview.component.scss']
})
export class ExperimentOverviewComponent implements OnInit{
  
  public project: Project = new Project();
  public owner: OwnerInfo = new OwnerInfo();
  
  private getProjectId(): number{
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  public showsFileInput: boolean = false;
  public showsDataset: boolean = false;
  
  
  @Output() EditExperimentEvent: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild("descriptionTextArea")
  public description: ElementRef;
  @ViewChild("publicCheckbox")
  public publicCheckbox: ElementRef;
  
  
  @ViewChild("dataset")
  public datasetComponent: DataSetTableComponent;
  @ViewChild("pageControls")
  public controlsComponent: PageControlsComponent; 
  
  public HasDatasetChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectsService,
    private datasetService: DatasetService
  ) { }
  
  ngOnInit(): void {
    this.projectService.getProject(this.getProjectId(), this, this.handleSuccesfulGetProjectCallback);
    this.projectService.getOwner(this.getProjectId(), this, this.handleSuccesfulGetOwnerCallback);
  }
  
  
  
  
  // CALLBACKS =======================================================================================
  
  private handleSuccesfulGetOwnerCallback(self: any, response: any){
    self.owner = response;
  }
  
  
  private handleSuccesfulGetProjectCallback(self: ExperimentOverviewComponent, response: any){
    self.project = response;
    
    // self.project.hasDataset se ponasa i izgleda kao string a prepoznaje se kao boolean
    // ovo dovodi do toga da ne mozemo da pitamo self.project.hasDataset == true
    
    if(self.project.hasDataset.toString().toLowerCase() == "true"){
      self.showsFileInput = false;
      self.showsDataset = true;
      self.ChangeDatasetPage(1);
    }
    
    if(self.project.hasDataset.toString().toLowerCase() == "false"){
      self.showsDataset = false;
      self.showsFileInput = true;
    }
  }
  
  
  
  
  
  private datasetPageRecieved(self: ExperimentOverviewComponent, response: any){
    // VRLO GLUPO ALI NE ZNAM ZASTO OVO RADI
    self.datasetComponent.LoadDataset(JSON.parse(JSON.parse(response.dataset).dataset));
    self.controlsComponent.SetPageCount(response.pages);
  }
  
  public ChangeDatasetPage(pageNumber: number){
    this.datasetService.GetDatasetPage(this.getProjectId(), true, pageNumber, ROW_COUNT, this, this.datasetPageRecieved);
  }
  
  
  public SendEditProject(){
    this.EditExperimentEvent.emit(
      {
        "description": this.description.nativeElement.value, 
        "isPublic": this.publicCheckbox.nativeElement.checked
      }
    );
  }
  
  
  
  
  
  
  
  
  
  
  
  public UploadDatasetFile(file: File){
    let formData : FormData = new FormData();
    formData.append("dataset", file);
    
    this.datasetService.AddDataset(formData, this.getProjectId(), this, this.datasetUploadHandler, this.badDataFormatHandler, this.unauthorizedHandler);
  }
  
  private datasetUploadHandler(self : ExperimentOverviewComponent){
    self.HasDatasetChanged.emit(true);
    
    self.showsFileInput = false;
    self.showsDataset = true;
    self.ChangeDatasetPage(1);
  }
  
  private badDataFormatHandler(self : ExperimentOverviewComponent, response: any){
    console.log(response);
  }
  
  private unauthorizedHandler(self : ExperimentOverviewComponent, response: any){
    console.log(response);
  }
  
  
  
}
