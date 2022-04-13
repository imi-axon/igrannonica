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

  ngOnInit(): void {
  
  }

  //OVAJ NACIN NE VALJA JER SE FJA NE POZIVE ON HANDLE SUCCESS!!!!!!!!!
  receiveMessage() {
    window.location.reload();

  }

}
