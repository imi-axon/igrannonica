import { Component, OnInit } from '@angular/core';
import { Layout, Edge , Node } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-nn',
  templateUrl: './nn.component.html',
  styleUrls: ['./nn.component.scss']
})


export class NnComponent implements OnInit {

  curve=shape.curveBundle.beta(1);

  links:Edge[]=
  [
    {
      id: 'a',
      source: 'i1',
      target: 'h1',
      label: 'i1-h1'
    }, {
      id: 'b',
      source: 'i1',
      target: 'h2',
      label: 'i1-h2'
    },
    {
      id:'c',
      source:'i1',
      target:'h3',
      label:'i1-h3'
    },
    {
      id:'d',
      source:'i1',
      target:'h4',
      label:'i1-h4'
    },
    {
      id:'e',
      source:'i2',
      target:'h1',
      label:'i2-h1'
    },
    {
      id:'f',
      source:'i2',
      target:'h2',
      label:'i2-h2'
    },
    {
      id:'g',
      source:'i2',
      target:'h3',
      label:'i2-h3'
    }
    ,
    {
      id:'g',
      source:'i2',
      target:'h4',
      label:'i2-h4'
    },
    {
      id:'h',
      source:'h1',
      target:'output',
      label:'h1-o'
    }
    ,
    {
      id:'i',
      source:'h2',
      target:'output',
      label:'h2-o'
    }
    ,
    {
      id:'j',
      source:'h3',
      target:'output',
      label:'h3-o'
    }
    ,
    {
      id:'k',
      source:'h4',
      target:'output',
      label:'h4-o'
    }

  ]

  constructor() { }

 
  ngOnInit(): void {
  }

  public funkcija(event:Event) {
    
    console.log("kliknuto");
}

}
