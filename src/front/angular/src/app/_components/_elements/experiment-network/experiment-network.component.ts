import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/_utilities/_data-types/models';
import { NeuralNetworkDisplayComponent } from '../neural-network-display/neural-network-display.component';

@Component({
  selector: 'app-experiment-network',
  templateUrl: './experiment-network.component.html',
  styleUrls: ['./experiment-network.component.scss']
})
export class ExperimentNetworkComponent implements OnInit {
  
  @Input() public project: Project;
  
  @ViewChild("networkDisplay")
  private display: ElementRef;
  
  @ViewChild("networkComponent")
  private networkComponent: NeuralNetworkDisplayComponent;
  
  private position = { top: 0, left: 0, x: 0, y: 0 };
  private dragging: boolean = false;
  
  
  private getProjectId(): number{
    let p = this.activatedRoute.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      return Number.parseInt(p);
    }
    return -1;
  }
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Saljemo komponentu network komponenti da bi znali koliko je scrolovano kada prikazujemo input za tezinu
    setTimeout(() => {
      this.networkComponent.display = this.display;
    }, 0);
  }
  
  // Dragging controls
  
  public MouseDownHandler(event: MouseEvent){
    
    // Remove text/image/div... selections
    window?.getSelection()?.removeAllRanges();
    document.getSelection()?.empty();
    
    this.dragging = true;
    
    // Change cursor
    this.display.nativeElement.setAttribute("style", "cursor: grabbing;");
    
    this.position = {
      // The current scroll
      left: this.display.nativeElement.scrollLeft,
      top: this.display.nativeElement.scrollTop,
      // Get the current mouse position
      x: event.clientX,
      y: event.clientY,
  };
    
  }
  
  
  public MouseMoveHandler(event: MouseEvent){
    if(!this.dragging)
      return;
      
    // How far the mouse has been moved
    const dx = event.clientX - this.position.x;
    const dy = event.clientY - this.position.y;

    // Scroll the element
    this.display.nativeElement.scrollTop = this.position.top - dy;
    this.display.nativeElement.scrollLeft = this.position.left - dx;
  }
  
  
  public MouseUpHandler(event: MouseEvent){
    this.dragging = false;
    
    // Change cursor
    this.display.nativeElement.setAttribute("style", "cursor: grab;");
    
    
    console.log(this.dragging)
  }

}
