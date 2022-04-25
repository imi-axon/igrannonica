import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm, NgSelectOption } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { ProjectsService } from 'src/app/_utilities/_services/projects.service';

@Component({
  selector: 'app-lista-projekata',
  templateUrl: './lista-projekata.component.html',
  styleUrls: ['./lista-projekata.component.scss']
})
export class ListaProjekataComponent implements OnInit {
  
  constructor(private projectsService:ProjectsService,private authService:AuthService,private router:Router) { }
  private username:string=this.authService.korisnickoIme;
  public projekti:Project[]=[];
  public filtriraniProjekti:Project[]=[];
  public key:string='sort';

  private _searchTerm:string;
  get searchTerm():string{
    return this._searchTerm;
  }
  set searchTerm(value:string){
    this._searchTerm=value;
    this.filtriraniProjekti=this.filtriraj(value);
    if(this.key=='sort') this.sortSort();
    else if(this.key=='az') this.sortAZ();
    else if(this.key=='za') this.sortZA();
    else if(this.key=='sortRev') this.sortRev();
  }

  filtriraj(str:string){
    return this.projekti.filter(projekti=>
      projekti.Name.toLowerCase().indexOf(str.toLowerCase())!==-1)

  }


  ngOnInit(): void {
    this.projectsService.userProjects(this.username,this,this.handleSuccess,this.handleError);
  }

  loadProjectsCallback(self: any){
    self.projectsService.userProjects(self.username,self,self.handleSuccess,self.handleError);
  }

  handleSuccess(self: any, projekti: Project[]) {
    console.log("Tacno jeeeeeee");
    if(projekti) {
      self.projekti=projekti;
      self.filtriraniProjekti=projekti;
    }
    //console.log(projekti[0]);
    //console.log(projekti[0].Description);
 
  }

  handleError(self: any, message: string) {
    console.log("GRESKA")
    // self.errorMessage = message;
    // self.isSignUpFailed = true;
  }

  onChange(select:any){

    this.key=select.target.value;
    console.log(this.key);

    if(this.key=='za') this.sortZA();
    else if(this.key=='az') this.sortAZ();
    else if(this.key=='sort') this.sortSort();
    else if(this.key=='sortRev') this.sortRev();
  }

  sortAZ(){
    this.filtriraniProjekti.sort((a, b) => a.Name.localeCompare(b.Name));
  }

  sortZA(){
    this.filtriraniProjekti.sort((a, b) => b.Name.localeCompare(a.Name));
  }

  sortSort(){
    this.filtriraniProjekti.sort((a,b)=>a.ProjectId-b.ProjectId);
  }

  sortRev(){
    this.filtriraniProjekti.sort((a,b)=>b.ProjectId-a.ProjectId);
  }

  onClick(projId:any, hasDataset:any){
    console.log(projId);
    console.log(hasDataset);

    if(hasDataset=='true'){
      this.router.navigate(['/project/'+projId]);
    }
    else if(hasDataset=='false'){
    this.router.navigate(['/dataset/'+projId]);
    }
  }

  RemoveProject(event: any, projectId: number){
    this.projectsService.removeProject(projectId, this, this.loadProjectsCallback);
    event.stopPropagation();
  }

}
