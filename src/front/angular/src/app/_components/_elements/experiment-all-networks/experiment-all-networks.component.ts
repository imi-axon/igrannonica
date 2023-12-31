import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewNN } from 'src/app/_utilities/_data-types/models';
import { NewNnService } from 'src/app/_utilities/_services/new-nn.service';
import { ExperimentPageComponent } from '../../_pages/experiment-page/experiment-page.component';
import { ExperimentNetworksListComponent } from '../experiments-networks-list/experiments-networks-list.component';
import { NetworkListComponent } from '../network-list/network-list.component';

@Component({
  selector: 'app-experiment-all-networks',
  templateUrl: './experiment-all-networks.component.html',
  styleUrls: ['./experiment-all-networks.component.scss']
})
export class ExperimentAllNetworksComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private newNNService: NewNnService
  ) { }
  
  @ViewChild("networksList")
  public networksList: NetworkListComponent;
  
  public projectId : number;
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)
      return Number.parseInt(p);
    return -1;
  }
  
  private newNN : NewNN = new NewNN();
  
  public parent: ExperimentPageComponent;

  ngOnInit(): void {
      
  }
  
  ngAfterViewInit(): void {
    this.networksList.parent = this.parent;
  }
  
  public NewNetwork(){
    this.newNN.Name= "Unitled-Network";
    this.newNNService.newNN(this.newNN, this.getProjectId(), this, this.handleSuccess, this.handleError);
  }

  handleSuccess(self: any,response:any) {
    self.networksList.RefreshList();
  }

  handleError(self: any, message: string) {
    self.networksList.RefreshList();
  }
  
}
