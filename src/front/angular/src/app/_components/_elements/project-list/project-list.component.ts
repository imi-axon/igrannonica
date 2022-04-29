import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  constructor(
    private projectsService: ProjectsService,
    public authService: AuthService,
    private router: Router
  ) { }

  private username: string = this.authService.korisnickoIme;

  public projects: Project[] = [];
  public filteredProjects: Project[] = [];
  public key: string = 'sort';

  private _searchTerm: string;
  public myExp:boolean=false;

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filteredProjects = this.filter(value);

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
    this.filteredProjects = this.filter(text);

    if (this.key == 'sort') this.sortSort();
    else
      if (this.key == 'az') this.sortAZ();
      else
        if (this.key == 'za') this.sortZA();
        else
          if (this.key == 'sortRev') this.sortRev();
  }

  @Input() publicExp:boolean; //true-JAVNI eksperimenti, false-Moji eksperimenti //public-exp-page i my-projects-page
  ngOnInit(): void {

    this.myExp=false;
    console.log("primio "+this.publicExp);
    if (this.publicExp==false) {
      console.log("pozivam fj1");
      this.myExp=true;
      this.projectsService.userProjects(this.username, this, this.handleSuccess, this.handleError);
    }
    else {
      console.log("pozivam fj2");
      this.projectsService.getProjects(this, this.handleSuccess, this.handleError);
    }

  }

  filter(str: string) {
    return this.projects.filter(projects => projects.Name.toLowerCase().indexOf(str.toLowerCase()) !== -1)
  }

  loadProjectsCallback(self: any) {
    self.projectsService.userProjects(self.username, self, self.handleSuccess, self.handleError);
  }

  handleSuccess(self: any, projects: Project[]) {
    if (projects) {
      self.projects = projects;
      self.filteredProjects = projects;
    }
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
    this.filteredProjects.sort((a, b) => a.Name.localeCompare(b.Name));
  }

  sortZA() {
    this.filteredProjects.sort((a, b) => b.Name.localeCompare(a.Name));
  }

  sortSort() {
    this.filteredProjects.sort((a, b) => a.ProjectId - b.ProjectId);
  }

  sortRev() {
    this.filteredProjects.sort((a, b) => b.ProjectId - a.ProjectId);
  }

  onClick(projId: any) {
    this.router.navigate(['/project/'+projId]);
  }

  RemoveProject(event: any, projectId: number) {
    this.projectsService.removeProject(projectId, this, this.loadProjectsCallback);
    event.stopPropagation();
  }

}
