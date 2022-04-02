import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewNN } from 'src/app/_utilities/_data-types/models';
import { NewNnService } from 'src/app/_utilities/_services/new-nn.service';

@Component({
  selector: 'app-create-neural-network',
  templateUrl: './create-neural-network.component.html',
  styleUrls: ['./create-neural-network.component.scss']
})
export class CreateNeuralNetworkComponent implements OnInit {

  public newNN= new NewNN();
  private ProjectId:number=1;//treba da bude id trenutnog projekta

  constructor(private newNNservice:NewNnService) { }
  sakriveno:boolean=true;

  onClick(){
    this.sakriveno=false;
  }

  onSubmit(f:NgForm){
    this.newNN.name=f.value.nnName;
    this.newNNservice.newNN(this.newNN,this.ProjectId,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any) {
    console.log("Tacno");
  }

  handleError(self: any, message: string) {
     console.log("netacno")
  }

  ngOnInit(): void {
  }

}
