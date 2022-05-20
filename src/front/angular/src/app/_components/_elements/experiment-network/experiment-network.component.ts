import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeuralNetwork, Project } from 'src/app/_utilities/_data-types/models';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { NetworkService } from 'src/app/_utilities/_services/network.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
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
    private statisticsService: StatisticsService,
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
  
  @Output() NetworkUpdated: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild("networkDisplay")
  public display: ElementRef;
  
  @ViewChild("networkComponent")
  private networkComponent: NeuralNetworkDisplayComponent;
  
  @ViewChild("changeInputOutputWindow")
  private changeInputOutputWindow: ElementRef;
  
  @ViewChild("grafik") 
  private grafik: ChartTrainingComponent;
  
  // NEURAL NETWORK
  public networkName: string = "";
  public neuralNetwork : NeuralNetwork = new NeuralNetwork();
  public runningTraining: boolean = false;
  
  public unusedColumns: string[] = [];
  public selectedColumns: string[] = [];
  
  private metadata: any;
  private once: boolean = true;

  ngOnInit(): void {
    this.networkService.GetNetwork(this.getProjectId(), this.getNetworkId(), this, this.successGetNetworkCallback);
    this.statisticsService.GetStatistics(this.getProjectId(), true, this, this.successGetStatisticsCallback);
  }
  
  private successGetNetworkCallback(self: any, response: any){
    //self.unusedColumns = Object.keys(JSON.parse(JSON.parse(response.dataset).dataset)[0])
    self.networkName = response.name;
    self.neuralNetwork = new NeuralNetwork();
    self.neuralNetwork.conf = JSON.parse(response.conf);
    self.neuralNetwork.nn = JSON.parse(JSON.parse(response.nn).nn);
    self.networkComponent.Refresh();
    console.log(self.neuralNetwork)
    
    let columns = Object.keys(self.metadata.columns);
    self.unusedColumns = [];
    for(let i = 0; i < columns.length; i++)
      if(self.metadata.columns[columns[i]].trainReady == true)
        if( self.neuralNetwork.conf.inputs.find((column: string) => {return columns[i] == column}) == undefined && self.neuralNetwork.conf.outputs.find((column: string) => {return columns[i] == column}) == undefined )
          self.unusedColumns.push(columns[i]);
    
    if(self.once){
      
      let removeList: string[] = [];
      self.neuralNetwork.conf.inputs.forEach((input: string) => {
        if(self.metadata.columns[input].trainReady == false)
          removeList.push(input)
      });
      removeList.forEach((input: string) => {
        self.networkComponent.BanishInputClick(input)
      });
      
      removeList = [];
      self.neuralNetwork.conf.outputs.forEach((output: string) => {
        if(self.metadata.columns[output].trainReady == false)
          removeList.push(output)
      });
      removeList.forEach((output: string) => {
        self.networkComponent.BanishOutputClick(output)
      });
      
      /*
      for(let i = 0; i < self.neuralNetwork.conf.inputs.length; i++)
        if(self.metadata.columns[self.neuralNetwork.conf.inputs[i]].trainReady == false)
          self.networkComponent.BanishInputClick(self.neuralNetwork.conf.inputs[i]);
      
      for(let i = 0; i < self.neuralNetwork.conf.outputs.length; i++)
        if(self.metadata.columns[self.neuralNetwork.conf.outputs[i]].trainReady == false)
          self.networkComponent.BanishOutputClick(self.neuralNetwork.conf.outputs[i]);
          */
      self.once = false;
    }
    
    self.NetworkUpdated.emit(self.networkName);
  }
  
  private successGetStatisticsCallback(self: any, metadata: any){
    self.metadata = metadata;
    console.log(metadata)
  }
  
  
  
  public StartTraining() {
    this.runningTraining = true;
    this.wsService.train(this.getProjectId(), this.getNetworkId(), this.neuralNetwork.conf, this, this.updateTrainData);
  }
  
  
  updateTrainData(self: ExperimentNetworkComponent, epochs: any) {
    
    for (const epoch of epochs) {
      // console.log(epoch)
      self.grafik.dataUpdate(epoch['epoch'], epoch['val_loss'], epoch['loss']);
    }

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
  
  
  
  public ChangeEpochsDuration(event: any){
    this.neuralNetwork.conf.epochsDuration = event.currentTarget.value;
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
