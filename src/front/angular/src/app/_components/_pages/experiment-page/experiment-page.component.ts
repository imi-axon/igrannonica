import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerInfo, Project } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { UserService } from 'src/app/_utilities/_services/user.service';
import { ExperimentAllNetworksComponent } from '../../_elements/experiment-all-networks/experiment-all-networks.component';
import { ExperimentEditComponent } from '../../_elements/experiment-edit/experiment-edit.component';
import { ExperimentNetworkComponent } from '../../_elements/experiment-network/experiment-network.component';
import { ExperimentOverviewComponent } from '../../_elements/experiment-overview/experiment-overview.component';
import { ExperimentNetworksListComponent } from '../../_elements/experiments-networks-list/experiments-networks-list.component';

@Component({
  selector: 'app-experiment-page',
  templateUrl: './experiment-page.component.html',
  styleUrls: ['./experiment-page.component.scss']
})
export class ExperimentPageComponent implements OnInit, AfterViewInit {
  
  constructor(
    public projectsService: ProjectsService,
    public activatedRoute: ActivatedRoute,
    public projectService: ProjectsService,
    public authService: AuthService,
    public userSerive: UserService,
    public router:Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
   }
   
  public owner: OwnerInfo = new OwnerInfo();
  
  @ViewChild("titleInput")
  inputTitle: ElementRef;
  
  @ViewChild("networkInput")
  networkTitle: ElementRef;
  showsNetwork = false;
  public networkName: string = "";
  
  private oldProjectName: string = "";
  private oldNetworkName: string = "";
  
  // ROUTER-OUTLET
  public overviewComponent: ExperimentOverviewComponent;
  public editComponent: ExperimentEditComponent;
  public singleNetworkComponent: ExperimentNetworkComponent;
  public experimentAllNetworks: ExperimentAllNetworksComponent;
  
  // Project
  public project: Project = new Project();
  public projectId: number;
  
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)
      this.projectId = Number.parseInt(p);
  }
  
  // Cards
  public currentCard: string = ".";
  
  ngAfterViewInit(): void {
    
  }
  
  ngOnInit(): void {
    this.checkProjectId();
    
    this.projectService.getOwner(this.projectId, this, this.handleSuccesfulGetOwnerCallback);
    
    this.RefreshProject();
    
    if(this.activatedRoute.children[0].snapshot.routeConfig?.path)
      this.currentCard = this.activatedRoute.children[0].snapshot.routeConfig?.path;
  }
  
  private handleSuccesfulGetOwnerCallback(self: any, response: any){
    self.owner = response;
  }
  
  public RefreshProject(){
    this.projectsService.getProject(this.projectId, this, this.handleSuccesfulGetProjectCallback);
  }
  
  
  public ResizeTitleField(field: any){
    field.nativeElement.style.width = field.value.length + "ch";
  }
  
  
  
  
  public OnActivate(component: any){
    
    // TRENUTNA KARTICA JE OVERVIEW
    if(component instanceof ExperimentOverviewComponent){
      
      setTimeout(() => { this.inputTitle.nativeElement.setAttribute('contenteditable', '') }, 0);
      this.overviewComponent = component;
      this.overviewComponent.EditExperimentEvent.subscribe( (edits: any) => this.ChangeExperiment(edits) );
      this.overviewComponent.HasDatasetChanged.subscribe( (hasDataset: boolean) => this.project.hasDataset = hasDataset );
      this.overviewComponent.parent = this;
    }
    else
      setTimeout(() => { this.inputTitle.nativeElement.removeAttribute('contenteditable', '') }, 0);
    
    
    if(component instanceof ExperimentNetworkComponent){
      setTimeout(() => {
        this.singleNetworkComponent = component;
        this.singleNetworkComponent.NetworkUpdated.subscribe( (name: any) => { this.networkName = name; this.oldNetworkName = name; } );
        this.showsNetwork = true;
        this.singleNetworkComponent.parent = this;
      }, 0);
    }
    else
      this.showsNetwork = false;
      
    if(component instanceof ExperimentAllNetworksComponent){
      this.experimentAllNetworks = component;
      this.experimentAllNetworks.parent = this;
      this.experimentAllNetworks.networksList.parent = this;
    }
    
    if(component instanceof ExperimentEditComponent){
      this.editComponent = component;
      this.editComponent.parent = this;
    }
  }
  

  
  
  
  
  public ChangeNetworkTitleRequest(event?: KeyboardEvent){
    if(event && event.key != "Enter")
      return;
    
    console.log("TEST")
    console.log(this.oldNetworkName)
    
    if(this.networkTitle.nativeElement.innerHTML.trim() == ""){
      this.networkTitle.nativeElement.innerHTML = this.oldNetworkName;
      this.networkTitle.nativeElement.blur();
      return;
    }
    
    this.oldNetworkName = this.networkTitle.nativeElement.innerHTML;
    
    this.singleNetworkComponent.ChangeNetworkTitle(this.networkTitle.nativeElement.innerHTML);
    
    this.networkTitle.nativeElement.blur();
  }
  
  public ChangeExperimentTitleRequest(event?: KeyboardEvent){
    if(event && event.key != "Enter")
      return;
    
    if(this.inputTitle.nativeElement.innerHTML.trim() == ""){
      this.inputTitle.nativeElement.innerHTML = this.oldProjectName;
      this.inputTitle.nativeElement.blur();
      return;
    }
    
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
    console.log(edits)
    if(this.inputTitle.nativeElement.value==""){
      this.fullEdits={
        "name": "Untitled-Experiment-" + this.projectId,
        "ispublic": edits.isPublic,
        "description": JSON.stringify(edits.description).slice(1, JSON.stringify(edits.description).length - 1)
      }
    }
    if(edits.description==""){
      this.fullEdits={
        "name": this.inputTitle.nativeElement.innerHTML,
        "ispublic": edits.isPublic,
        "description": " "
      }
    }
    else {
      this.fullEdits= {
        "name": this.inputTitle.nativeElement.innerHTML,
        "ispublic": edits.isPublic,
        "description": JSON.stringify(edits.description).slice(1, JSON.stringify(edits.description).length - 1)
      }
    }
    
    this.projectsService.editProject(this.projectId, this.fullEdits);
    
    this.inputTitle.nativeElement.blur();
  }
  
  
  
  
  
  // CALLBACKS ================================================================================
  
  private handleSuccesfulGetProjectCallback(self: ExperimentPageComponent, response: any){
    self.project = response;
    self.oldProjectName = response.Name;
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