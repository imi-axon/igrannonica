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
  ) { }
  
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
    this.projectsService.getProject(this.projectId, this, this.handleSuccesfulGetProjectCallback);
    
    if(this.activatedRoute.children[0].snapshot.routeConfig?.path)
      this.currentCard = this.activatedRoute.children[0].snapshot.routeConfig?.path;
  }
  
  
  public OnActivate(component: any){
    
    // TRENUTNA KARTICA JE OVERVIEW
    if(component instanceof ExperimentOverviewComponent){
      this.overviewComponent = component;
      
      this.overviewComponent.EditExperimentEvent.subscribe( (edits: any) => this.ChangeExperiment(edits) );
    }
  }
  
  public ChangeExperimentTitleRequest(){
    let description = this.overviewComponent.description.nativeElement.value;
    let isPublic = this.overviewComponent.publicCheckbox.nativeElement.checked;
    this.ChangeExperiment(
      {
        "description": description, 
        "isPublic": isPublic
      }
    );
  }
  
  public ChangeExperiment(edits: any){
    let fullEdits: any = {
      "name": this.inputTitle.nativeElement.value,
      "ispublic": edits.isPublic,
      "description": edits.description
    }
    
    this.projectsService.editProject(this.projectId, fullEdits);
  }
  
  
  
  
  
  // CALLBACKS ================================================================================
  
  private handleSuccesfulGetProjectCallback(self: ExperimentPageComponent, response: any){
    self.project = response;
  }
  
  
  
  
  
  // SWITCH ===================================================================================
  public SwitchCard(cardName: string){
    this.currentCard = cardName;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  public SwitchCardCombo(comboEvent: any){
    this.currentCard = comboEvent.currentTarget.value;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  
  
  
  
  
}