import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
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
  
  // Project
  public project: Project = new Project();
  public projectId: number;
  private checkProjectId(){
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      this.projectId = Number.parseInt(p);
      //console.log('ProjectId')
      //console.log(this.ProjectId)
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
  
  
  
  private handleSuccesfulGetProjectCallback(self: ExperimentPageComponent, response: any){
    self.project = response;
  }
  
  
  
  public SwitchCard(cardName: string){
    this.currentCard = cardName;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  public SwitchCardCombo(comboEvent: any){
    this.currentCard = comboEvent.currentTarget.value;
    this.router.navigate([this.currentCard],{relativeTo:this.activatedRoute});
  }
  
  
  
  
  
  
}




/* OSTATAK 
    if(component instanceof ExperimentOverviewComponent)
    
      this.statisticsComponent = component;
      this.statistika=true;
      if(this.statisticsComponent != undefined){
        
        setTimeout(() => {
          this.statisticsComponent.correlationLoader.start();
          this.statisticsComponent.statisticsLoader.start();
        }, 0);
          
        this.statisticsAPI.GetStatistics(this.ProjectId, false, this, this.successfulGetStatisticsCallback);
      }
        
      
      this.showsEditOptions = false;
      

      return;
    }
    
    this.statistika=false;
      
    this.editComponent = component;
    
    this.UpdatePageData({currentPage: 1, rowsPerPage: this.editComponent.rowsPerPage});
    
    this.editComponent.PageLoadEvent.subscribe( change => this.UpdatePageDataFromMain(change) );
    
    this.editComponent.ChangedField.subscribe( change => this.HandleFieldChange(change) );
    this.editComponent.DataUpdateNeeded.subscribe( change => this.UpdatePageData(change) );
    this.editComponent.SaveDataNeeded.subscribe( event =>this.SaveData() );
    
    this.showsEditOptions = true;
  }
  */