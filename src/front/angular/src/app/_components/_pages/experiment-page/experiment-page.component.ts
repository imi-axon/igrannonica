import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { ExperimentOverviewComponent } from '../../_elements/experiment-overview/experiment-overview.component';

@Component({
  selector: 'app-experiment-page',
  templateUrl: './experiment-page.component.html',
  styleUrls: ['./experiment-page.component.scss']
})
export class ExperimentPageComponent implements OnInit {
  
  constructor(
    public projectsService: ProjectsService,
    public activatedRoute: ActivatedRoute,
    public router:Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
   }
  
  @ViewChild("titleInput")
  inputTitle: ElementRef;
  
  // ROUTER-OUTLET
  public overviewComponent: ExperimentOverviewComponent;
  
  // Project
  public project: Project = new Project();
  public projectId: number;
  
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      this.projectId = Number.parseInt(p);
    }
  }
  
  // Cards
  public currentCard: string = ".";
  
  ngOnInit(): void {
    this.checkProjectId();
    
    this.RefreshProject();
    
    if(this.activatedRoute.children[0].snapshot.routeConfig?.path)
      this.currentCard = this.activatedRoute.children[0].snapshot.routeConfig?.path;
  }
  
  public RefreshProject(){
    this.projectsService.getProject(this.projectId, this, this.handleSuccesfulGetProjectCallback);
  }
  
  
  public OnActivate(component: any){
    
    // TRENUTNA KARTICA JE OVERVIEW
    if(component instanceof ExperimentOverviewComponent){
      
      this.overviewComponent = component;
      
      this.overviewComponent.EditExperimentEvent.subscribe( (edits: any) => this.ChangeExperiment(edits) );
      this.overviewComponent.HasDatasetChanged.subscribe( (hasDataset: boolean) => this.project.hasDataset = hasDataset );
    }
  }
  
  public ChangeExperimentTitleRequest(event?: KeyboardEvent){
    if(event && event.key != "Enter")
      return;
    
    let description = this.overviewComponent.description.nativeElement.value;
    let isPublic = this.overviewComponent.publicCheckbox.nativeElement.checked;
    this.ChangeExperiment(
      {
        "description": description, 
        "isPublic": isPublic
      }
    );
  }

  public fullEdits:any;
  
  public ChangeExperiment(edits: any){
    if(this.inputTitle.nativeElement.value==""){
    this.fullEdits={
      "name": "Untitled-Experiment-" + this.projectId,
      "ispublic": edits.isPublic,
      "description": edits.description
    }
  }
    else {
    this.fullEdits= {
      "name": this.inputTitle.nativeElement.value,
      "ispublic": edits.isPublic,
      "description": edits.description
    }
  }
    
    this.projectsService.editProject(this.projectId, this.fullEdits);
    
    this.inputTitle.nativeElement.blur();
  }
  
  
  
  
  
  // CALLBACKS ================================================================================
  
  private handleSuccesfulGetProjectCallback(self: ExperimentPageComponent, response: any){
    self.project = response;
  }
  
  
  
  
  
  // SWITCH ===================================================================================
  public SwitchCard(cardName: string){
    if(this.project.hasDataset.toString() == "False")
      return;
      
    this.currentCard = cardName;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  public SwitchCardCombo(comboEvent: any){
    if(this.project.hasDataset.toString() == "False")
      return;
    
    this.currentCard = comboEvent.currentTarget.value;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  
  
  
  
  
}