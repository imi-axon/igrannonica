import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  private TEST_PROJECT_ID: number = 99999;
  
  constructor(private datasetService: DatasetService, private router: Router) { }
  
  ngOnInit(): void {
    
  }
  
  public showDataset(){
    this.datasetHidden = false;
  }
  
  public sendDataset(csv: string){
    // this.errorMessage = "";
    // this.datasetService.AddDataset(csv, this.TEST_PROJECT_ID, this, this.handleSuccess, this.handleBadDataFormat, this.handleUnauthorized);
    this.datasetService.AddDataset(csv, 1, this, this.handleSuccess);
  }
  
  private handleSuccess(self:any){
    console.log("Uspesan POST dataseta.");
   // self.router.navigate(['statistics']);
  }
  
  
  private handleBadDataFormat(self: any, message: string){
    this.errorMessage = message;
  }
  
  private handleUnauthorized(self: any, message: string){
    this.errorMessage = message;
  }
  

}
