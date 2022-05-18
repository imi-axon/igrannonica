import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeuralNetwork, Project } from 'src/app/_utilities/_data-types/models';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { NetworkService } from 'src/app/_utilities/_services/network.service';
import { ChartTrainingComponent } from '../chart-training/chart-training.component';
import { NeuralNetworkDisplayComponent } from '../neural-network-display/neural-network-display.component';

@Component({
  selector: 'app-experiment-network',
  templateUrl: './experiment-network.component.html',
  styleUrls: ['./experiment-network.component.scss']
})
export class ExperimentNetworkComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private networkService: NetworkService,
    private wsService: TrainingApiService
  ) { }
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      return Number.parseInt(p);
    }
    return -1;
  }
  
  private getNetworkId(): number{
    let p = this.activatedRoute.snapshot.paramMap.get("NetworkId");
    if(p==null)
      return -1;
    return Number.parseInt(p);
  }
  
  
  @Input() public project: Project;
  
  @ViewChild("networkDisplay")
  public display: ElementRef;
  
  @ViewChild("networkComponent")
  private networkComponent: NeuralNetworkDisplayComponent;
  
  @ViewChild("changeInputOutputWindow")
  private changeInputOutputWindow: ElementRef;
  
  @ViewChild("grafik") 
  private grafik: ChartTrainingComponent;
  
  // NEURAL NETWORK
  public neuralNetwork : NeuralNetwork = new NeuralNetwork();
  public runningTraining: Boolean = false;
  
  public unusedColumns: string[] = [];
  public selectedColumns: string[] = [];
  
  

  ngOnInit(): void {
    this.networkService.GetNetwork(this.getProjectId(), this.getNetworkId(), this, this.successGetNetworkCallback)
  }
  
  private successGetNetworkCallback(self: any, response : any){
    //self.unusedColumns = Object.keys(JSON.parse(JSON.parse(response.dataset).dataset)[0])
    self.neuralNetwork = new NeuralNetwork();
    self.neuralNetwork.conf = JSON.parse(response.conf);
    self.neuralNetwork.nn = JSON.parse(JSON.parse(response.nn).nn);
    self.networkComponent.Refresh();
    console.log(self.neuralNetwork)
  }
  
  
  // TEMP TEMP TEMP TEMP TEMP TEMP TEMP TEMP
  public log(){
    console.log(this.neuralNetwork);
  }
  
  
  
  
  public StartTraining() {
    this.runningTraining = true;
    this.wsService.train(this.getProjectId(), this.getNetworkId(), this.neuralNetwork.conf, this, this.updateTrainData);
  }
  
  
  updateTrainData(self: ExperimentNetworkComponent, data: any) {
    let tLoss = data['t_loss'];
    let vLoss = data['v_loss'];
    let ep = data['epoch'];
    
    self.grafik.dataUpdate(ep, tLoss, vLoss);
  }
  
  
  // COLUMN SELECTION
  
  private removeStringFromList(list: string[], column: string){
    for(let i = 0; i < list.length; i++)
      if(list[i] == column){
        list.splice(i, 1);
        return list;
      }
    
    return list;
  }
  
  public SelectColumn(column: string){
    if(this.IsSelected(column))
      this.selectedColumns = this.removeStringFromList(this.selectedColumns, column);
    else
      this.selectedColumns.push(column)
  }
  
  public IsSelected(column: string){
    for(let i = 0; i < this.selectedColumns.length; i++)
      if(this.selectedColumns[i] == column)
        return true;
    return false;
  }
  
  
  public MoveToInput(){
    for(let i = 0; i < this.selectedColumns.length; i++){
      this.networkComponent.AddColumnToInput(this.selectedColumns[i])
      this.unusedColumns = this.removeStringFromList(this.unusedColumns, this.selectedColumns[i])
    }
    this.selectedColumns = [];
  }
  
  public MoveToOutput(){
    for(let i = 0; i < this.selectedColumns.length; i++){
      this.networkComponent.AddColumnToOutput(this.selectedColumns[i])
      this.unusedColumns = this.removeStringFromList(this.unusedColumns, this.selectedColumns[i])
    }
    this.selectedColumns = [];
  }
  
  
  // Dragging controls =====================================================================
  private position = { top: 0, left: 0, x: 0, y: 0 };
  private dragging: boolean = false;
  
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
  }

}
