import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NN } from 'src/app/_utilities/_data-types/models';
import { AuthService } from 'src/app/_utilities/_services/auth.service';
import { NnService } from 'src/app/_utilities/_services/nn.service';
import { ExperimentPageComponent } from '../../_pages/experiment-page/experiment-page.component';
import { PopupWindowComponent } from '../popup-window/popup-window.component';

@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrls: ['./network-list.component.scss']
})
export class NetworkListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private authService:AuthService,
    private translate: TranslateService,
    private nnService:NnService, 
    private activatedRoute:ActivatedRoute, 
    private router:Router
  ) { }

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
    else if(this.key=='sortRev') this.sortRev();
  }

  public parent: ExperimentPageComponent;
  
  public SetSearchTerm(value:string){
    this.searchTerm = value;
  }
  
  filtriraj(str:string){
    return this.mreze.filter(mreze=>
      mreze.name.toLowerCase().indexOf(str.toLowerCase())!==-1)

  }
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  ngOnInit(): void {
    console.log(this.getProjectId())
    this.RefreshList();
  }

  RefreshList(){
    this.nnService.projectsNN(this.getProjectId(), this, this.handleSuccess, function() {}, this.emptyListCallback, function() {});
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

  OpenNetwork(id:any){
    this.router.navigate([id],{relativeTo:this.activatedRoute});
  }



  // BRISANJE MREZE
  porukaPopup: String = "";

  openDialog(event: any, networkId: number){
    this.porukaPopup = this.translate.instant("popup-window.project");
    let dialogRef = this.dialog.open(PopupWindowComponent, { data: { poruka: this.porukaPopup } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog res: ${result}`);
      if(result=='yes') 
      {
        console.log(result);
        this.nnService.deleteNN(this.getProjectId(), networkId, this, this.successfulDeleteCallback, function () {}, this.emptyListCallback, function () {})
      }
    });
  }
  
  successfulDeleteCallback(self: NetworkListComponent){
    self.nnService.projectsNN(self.getProjectId(), self, self.handleSuccess, function() {}, self.emptyListCallback, function() {});
  }
  
  emptyListCallback(self: NetworkListComponent){
    self.mreze = [];
    self.filtriraneMreze = [];
  }

}