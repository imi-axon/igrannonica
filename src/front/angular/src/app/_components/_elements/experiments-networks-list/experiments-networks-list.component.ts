import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NN, OwnerInfo } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { NnService } from 'src/app/_utilities/_services/nn.service';
import { ExperimentPageComponent } from '../../_pages/experiment-page/experiment-page.component';

@Component({
  selector: 'app-experiments-networks-list',
  templateUrl: './experiments-networks-list.component.html',
  styleUrls: ['./experiments-networks-list.component.scss']
})
export class ExperimentNetworksListComponent implements OnInit {

  constructor(private authService:AuthService,private nnService:NnService, private activatedRoute:ActivatedRoute, private router:Router) { }
  
  @Input() projectId: number;
  
  public parent: ExperimentPageComponent;
  
  public mreze:NN[]=[];
  public filtriraneMreze:NN[]=[];
  public key:string='sort';

  private _searchTerm:string;
  get searchTerm():string{
    return this._searchTerm;
  }
  set searchTerm(value:string){
    this._searchTerm=value;
    this.filtriraneMreze=this.filtriraj(value);
    if(this.key=='sort') this.sortSort();
    else if(this.key=='az') this.sortAZ();
    else if(this.key=='za') this.sortZA();
    else if(this.key=='sortRev') this.sortRev();
  }
  
  public SetSearchTerm(value:string){
    this.searchTerm = value;
  }

  filtriraj(str:string){
    return this.mreze.filter(mreze=>
      mreze.name.toLowerCase().indexOf(str.toLowerCase())!==-1)
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.nnService.projectsNN(this.projectId,this,this.handleSuccess,this.handleError);
    }, 0);
  }
  
  public RefreshList(){
    this.nnService.projectsNN(this.projectId,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any, mreze: NN[]) {
    console.log("Tacno jeeeeeee");
    console.log("kljuc je" + self.key);
    if(mreze) {
      self.mreze=mreze;
      self.filtriraneMreze=mreze;
    }
    if(self.key=='sort') self.sortSort();
    else if(self.key=='az') self.sortAZ();
    else if(self.key=='za') self.sortZA();
    else if(self.key=='sortRev') self.sortRev();

  //  console.log(mreze[0].name);
    //console.log(projekti[0]);
    //console.log(projekti[0].Description);
 
  }

  handleError(self: any, message: string) {
    console.log("GRESKA")
    // self.errorMessage = message;
    // self.isSignUpFailed = true;
  }

OrderBy(select:any){

  this.key=select.target.value;
  console.log(this.key);

  if(this.key=='za') this.sortZA();
  else if(this.key=='az') this.sortAZ();
  else if(this.key=='sort') this.sortSort();
  else if(this.key=='sortRev') this.sortRev();
}

sortAZ(){
  this.filtriraneMreze.sort((a, b) => a.name.localeCompare(b.name));
}

sortZA(){
  this.filtriraneMreze.sort((a, b) => b.name.localeCompare(a.name));
}

sortSort(){
  this.filtriraneMreze.sort((a,b)=>a.id-b.id);
}
sortRev(){
  this.filtriraneMreze.sort((a,b)=>b.id-a.id);
}

onClick(id:any){
  //this.router.navigate(['train/'+this.projectId+'/nn/'+id]);
  this.router.navigate([id],{relativeTo:this.activatedRoute});
}

  

}