import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewNN } from 'src/app/_utilities/_data-types/models';
import { NewNnService } from 'src/app/_utilities/_services/new-nn.service';
import { ListaMrezaComponent } from '../lista-mreza/lista-mreza.component';

@Component({
  selector: 'app-create-neural-network',
  templateUrl: './create-neural-network.component.html',
  styleUrls: ['./create-neural-network.component.scss']
})
export class CreateNeuralNetworkComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<any>();

  public newNN= new NewNN();
  private ProjectId:number=-1;

  constructor(private newNNservice:NewNnService, private activatedRoute:ActivatedRoute) { }
  sakriveno:boolean=true;

  onClick(){
    this.sakriveno=false;
  }

  closeClick(){
    this.sakriveno=true;
  }

  onSubmit(f:NgForm){
    this.newNN.Name=f.value.nnName;
    this.newNNservice.newNN(this.newNN,this.ProjectId,this,this.handleSuccess,this.handleError);
  }

  handleSuccess(self: any,response:any) {
    console.log("Tacno");
    self.nnId=response.id;
    console.log(response.id);
    self.sakriveno=false;
    self.messageEvent.emit();
  
  }

  handleError(self: any, message: string) {
     console.log("netacno")
  }

  ngOnInit(): void {

    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null) this.ProjectId=Number.parseInt(p);
  }

}
