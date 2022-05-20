import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-metrics-barplot',
  templateUrl: './metrics-barplot.component.html',
  styleUrls: ['./metrics-barplot.component.scss']
})
export class MetricsBarplotComponent implements OnInit {
  constructor() { }
  
  @ViewChild("plot1")
  plot1: ElementRef;
  @ViewChild("plot2")
  plot2: ElementRef;
  @ViewChild("plot3")
  plot3: ElementRef;
  
  
  public value1: number = 0;
  public value2: number = 0;
  
  ngOnInit(): void {
    setTimeout(() => {
      this.RefreshBarplot(0, 0);
    }, 0);
  }
  
  public RefreshBarplot(v1: number, v2: number){
    this.value1 = v1;
    this.value2 = v2;
    
    this.plot1.nativeElement.setAttribute('style', 'width: ' + (this.value1 * 100) + '%');
    this.plot2.nativeElement.setAttribute('style', 'width: ' + (this.value2 * 100) + '%');
  }
  
  

}
