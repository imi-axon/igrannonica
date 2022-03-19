import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  
  //private msBeforeIndicator = 100;
  //private timeout: any; 
  public isLoading = false;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  
    
  public start(){
      //this.timeout = setTimeout(() =>{
        this.isLoading = true;
      //}, this.msBeforeIndicator);
  }
  
  public stop(){
      this.isLoading = false;
      //clearTimeout(this.timeout);
  }

}
