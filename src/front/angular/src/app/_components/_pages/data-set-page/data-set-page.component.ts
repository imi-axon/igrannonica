import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';

@Component({
  selector: 'app-data-set-page',
  templateUrl: './data-set-page.component.html',
  styleUrls: ['./data-set-page.component.scss']
})
export class DataSetPageComponent implements OnInit {
  
  public datasetHidden:boolean = true;
  
  // TEST PROJECT ID, IZBRISATI KADA BUDEMO IMALI PRAVI ID
  private TEST_PROJECT_ID: number = 99999;
  
  constructor(private datasetService: DatasetService, private router: Router) { }

  ngOnInit(): void {
    
  }
  
  public showDataset(data:any){
    this.datasetHidden = false;
  }
  
  public sendDataset(csv: string){
    this.datasetService.addCSV(csv, this.TEST_PROJECT_ID, this, this.postSuccess);
  }
  
  private postSuccess(self:any){
    console.log("Uspesan POST dataseta.");
    self.router.navigate(['statistics']);
  }
  

}
