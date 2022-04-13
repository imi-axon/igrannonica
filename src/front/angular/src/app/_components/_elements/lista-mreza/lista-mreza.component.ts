import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NN } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { NnService } from 'src/app/_utilities/_services/nn.service';

@Component({
  selector: 'app-lista-mreza',
  templateUrl: './lista-mreza.component.html',
  styleUrls: ['./lista-mreza.component.scss']
})
export class ListaMrezaComponent implements OnInit {

  constructor(private authService:AuthService,private nnService:NnService, private activatedRoute:ActivatedRoute, private router:Router) { }

  private projectID:number=-1;
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
  }

  filtriraj(str:string){
    return this.mreze.filter(mreze=>
      mreze.name.toLowerCase().indexOf(str.toLowerCase())!==-1)

  }

  ngOnInit(): void {
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) this.projectID=Number.parseInt(p);
    this.nnService.projectsNN(this.projectID,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any, mreze: NN[]) {
    console.log("Tacno jeeeeeee");
    if(mreze) {
      self.mreze=mreze;
      self.filtriraneMreze=mreze;
    }

  //  console.log(mreze[0].name);
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

onClick(id:any){
  this.router.navigate(['train/'+this.projectID+'/nn/'+id]);
}

}
