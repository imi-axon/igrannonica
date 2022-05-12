import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewNN } from 'src/app/_utilities/_data-types/models';
import { NewNnService } from 'src/app/_utilities/_services/new-nn.service';
import { ExperimentNetworksListComponent } from '../experiments-networks-list/experiments-networks-list.component';

@Component({
  selector: 'app-experiment-all-networks',
  templateUrl: './experiment-all-networks.component.html',
  styleUrls: ['./experiment-all-networks.component.scss']
})
export class ExperimentAllNetworksComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private newNNService: NewNnService
  ) { }
  
  @ViewChild("networksList")
  private networksList: ExperimentNetworksListComponent;
  
  public projectId : number;
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  private newNN : NewNN = new NewNN();

  ngOnInit(): void {
    this.projectId = this.getProjectId();
  }
  
  
  public NewNetwork(){
    this.newNN.Name= "Unitled-Network";
    this.newNNService.newNN(this.newNN,this.projectId,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any,response:any) {
    self.networksList.RefreshList();
  }

  handleError(self: any, message: string) {
    self.networksList.RefreshList();
  }
  
}
