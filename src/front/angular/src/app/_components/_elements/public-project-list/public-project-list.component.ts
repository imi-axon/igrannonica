import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PublicProject } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';
import { PopupWindowComponent } from '../popup-window/popup-window.component';

@Component({
  selector: 'app-public-project-list',
  templateUrl: './public-project-list.component.html',
  styleUrls: ['./public-project-list.component.scss']
})
export class PublicProjectListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    public authService: AuthService,
    private router: Router
  ) { }

  public publicProjects: PublicProject[] = [];
  public filteredPublicProjects: PublicProject[] = [];
  public key: string = 'sort';

  private _searchTerm: string;

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredPublicProjects = this.filter(value);

    if (this.key == 'sort') this.sortSort();
    else
      if (this.key == 'az') this.sortAZ();
      else
        if (this.key == 'za') this.sortZA();
        else
          if (this.key == 'sortRev') this.sortRev();
  }
  public SetSearchTerm(text: string) {
    this._searchTerm = text;
    this.filteredPublicProjects = this.filter(text);

    if (this.key == 'sort') this.sortSort();
    else
      if (this.key == 'az') this.sortAZ();
      else
        if (this.key == 'za') this.sortZA();
        else
          if (this.key == 'sortRev') this.sortRev();
  }
  
  ngOnInit(): void {
    this.projectsService.getProjects(this, this.handleGetPublicProject, this.handleGetPublicProject);
  }

  filter(str: string) {
    return this.publicProjects.filter(projects => projects.project.Name.toLowerCase().indexOf(str.toLowerCase()) !== -1)
  }

  loadProjectsCallback(self: any) {
    self.projectsService.getProjects(self, self.handleGetPublicProject, self.handleGetPublicProject);
  }

  handleGetPublicProject(self: any, response: any){
    let projects = [];
    for(let i = 0; i < response.length; i++){
      let project = new PublicProject();
      project.project = response[i][0]
      project.owner = response[i][1]
      projects.push(project)
    }
    self.publicProjects = projects;
    self.filteredPublicProjects = projects;
  }

  handleError(self: any, message: string) {
    console.log("GRESKA")
  }

  OrderBy(select: any) {
    this.key = select;

    if (this.key == 'za') this.sortZA();
    else if (this.key == 'az') this.sortAZ();
    else if (this.key == 'sort') this.sortSort();
    else if (this.key == 'sortRev') this.sortRev();
  }

  sortAZ() {
    this.filteredPublicProjects.sort((a, b) => a.project.Name.localeCompare(b.project.Name));
  }

  sortZA() {
    this.filteredPublicProjects.sort((a, b) => b.project.Name.localeCompare(a.project.Name));
  }

  sortSort() {
    this.filteredPublicProjects.sort((a, b) => a.project.ProjectId - b.project.ProjectId);
  }

  sortRev() {
    this.filteredPublicProjects.sort((a, b) => b.project.ProjectId - a.project.ProjectId);
  }

  onClick(projId: any) {
    this.router.navigate(['/project/' + projId]);
  }

  porukaPopup: String = "";
  
  openDialog(event: any, projectId: number){
    this.porukaPopup = this.translate.instant("popup-window.project");
    let dialogRef = this.dialog.open(PopupWindowComponent, { data: { poruka: this.porukaPopup } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog res: ${result}`);
      if(result=='yes') 
      {
        console.log(result);
        this.RemoveProject(event,projectId);
      }
    });
  }

  RemoveProject(event: any, projectId: number) { 
    this.projectsService.removeProject(projectId, this, this.loadProjectsCallback);
    event.stopPropagation();
    
  }

}
