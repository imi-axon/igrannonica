import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CreateNeuralNetworkComponent } from '../../_elements/create-neural-network/create-neural-network.component';
import { ListaMrezaComponent } from '../../_elements/lista-mreza/lista-mreza.component';

@Component({
  selector: 'app-nn-page',
  templateUrl: './nn-page.component.html',
  styleUrls: ['./nn-page.component.scss']
})
export class NnPageComponent implements OnInit {
  constructor(private router:Router) { }

  @ViewChild("lista") listnn:ListaMrezaComponent
  @ViewChild("newnn") newnn:CreateNeuralNetworkComponent

  ngOnInit(): void {
  
  }

  receiveMessage() {
  // window.location.reload();
    this.newnn.sakriveno=true;
    this.listnn.ngOnInit();
  

  }

}
