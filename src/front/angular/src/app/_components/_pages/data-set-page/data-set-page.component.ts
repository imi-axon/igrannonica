import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { LoaderComponent } from '../../_elements/loader/loader.component';

@Component({
  selector: 'app-data-set-page',
  templateUrl: './data-set-page.component.html',
  styleUrls: ['./data-set-page.component.scss']
})
export class DataSetPageComponent implements OnInit {
  
  public datasetHidden: boolean = true;
  public errorMessage: string = "";
  
  // TEST PROJECT ID, IZBRISATI KADA BUDEMO IMALI PRAVI ID
  //private TEST_PROJECT_ID: number = 99999;
  public ProjectId: number=-1;
  
  constructor(private datasetService: DatasetService, private router: Router,public activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    
  }
  
  public showDataset(){
    this.datasetHidden = false;
  }
  
  public sendDataset(csv: string){
    // this.errorMessage = "";
    // this.datasetService.AddDataset(csv, this.TEST_PROJECT_ID, this, this.handleSuccess, this.handleBadDataFormat, this.handleUnauthorized);
    
    //U lista-projekata.component.html na klik dugmeta se salje id projekta 'ProjectId'
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) this.ProjectId = p as unknown as number;
    
    this.datasetService.AddDataset(csv, this.ProjectId, this, this.handleSuccess,this.handleBadDataFormat,this.handleUnauthorized);
  }
  
  private handleSuccess(self:any){
    console.log("Uspesan POST dataseta."+self.ProjectId);
    self.router.navigate(['edit-dataset/'+self.ProjectId]);
  }
  
  
  private handleBadDataFormat(self: any, message: string){
    this.errorMessage = message;
  }
  
  private handleUnauthorized(self: any, message: string){
    this.errorMessage = message;
  }
  

}
