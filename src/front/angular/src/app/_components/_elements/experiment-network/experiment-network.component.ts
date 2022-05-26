import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeuralNetwork, Project } from 'src/app/_utilities/_data-types/models';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { NetworkService } from 'src/app/_utilities/_services/network.service';
import { NnService } from 'src/app/_utilities/_services/nn.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
import { ChartTrainingComponent } from '../chart-training/chart-training.component';
import { MetricsBarplotComponent } from '../metrics-barplot/metrics-barplot.component';
import { NeuralNetworkDisplayComponent } from '../neural-network-display/neural-network-display.component';

@Component({
  selector: 'app-experiment-network',
  templateUrl: './experiment-network.component.html',
  styleUrls: ['./experiment-network.component.scss']
})
export class ExperimentNetworkComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private nnService: NnService,
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
  
  
  
  @ViewChild("MSEbarplot")
  private MSEbarplot: MetricsBarplotComponent;
  @ViewChild("MAEbarplot")
  private MAEbarplot: MetricsBarplotComponent;
  
  @ViewChild("testBarplot")
  private testBarplot: MetricsBarplotComponent;
  
  
  
  @ViewChild("categoricalbarplot")
  private categoricalbarplot: MetricsBarplotComponent;
  @ViewChild("precisionbarplot")
  private precisionbarplot: MetricsBarplotComponent;
  
  @ViewChild("recallbarplot")
  private recallbarplot: MetricsBarplotComponent;
  
  @ViewChild("testbarplotdva")
  private testbarplotdva: MetricsBarplotComponent;
  
  // NEURAL NETWORK
  public networkName: string = "";
  public neuralNetwork : NeuralNetwork = new NeuralNetwork();
  public runningTraining: boolean = false;
  public trainingFinished: boolean = false;
  
  public unusedColumns: string[] = [];
  public selectedColumns: string[] = [];
  
  private metadata: any;
  private once: boolean = true;

  ngOnInit(): void {
    this.networkService.GetNetwork(this.getProjectId(), this.getNetworkId(), this, this.successGetNetworkCallback);
    this.statisticsService.GetStatistics(this.getProjectId(), true, this, this.successGetStatisticsCallback);

    setTimeout(() => {
    }, 0);
  }
  
  private successGetNetworkCallback(self: any, response: any){
    console.log("uspesno network");
    //self.unusedColumns = Object.keys(JSON.parse(JSON.parse(response.dataset).dataset)[0])
    self.networkName = response.name;
    self.neuralNetwork = new NeuralNetwork();
    self.neuralNetwork.conf = JSON.parse(response.conf);
    self.neuralNetwork.nn = JSON.parse(JSON.parse(response.nn).nn);
    console.log(self.neuralNetwork);
    self.networkComponent.Refresh();
 
    
    let columns = Object.keys(self.metadata.columns);
    self.unusedColumns = [];
    
    // DODAVANJE NEKORISCENIH KOLONA U unusedColumns
    for(let i = 0; i < columns.length; i++)
      if(self.metadata.columns[columns[i]].trainReady == true)
        if( self.neuralNetwork.conf.inputs.find((column: string) => {return columns[i] == column}) == undefined && self.neuralNetwork.conf.outputs.find((column: string) => {return columns[i] == column}) == undefined )
          self.unusedColumns.push(columns[i]);
    
    if(self.once){
      
      let removeList: string[] = [];
      self.neuralNetwork.conf.inputs.forEach((input: string) => {
        if(self.metadata.columns[input] == undefined || self.metadata.columns[input].trainReady == false)
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
      
      self.once = false;
    }
    
    self.neuralNetwork.conf.problemType = self.neuralNetwork.conf.problemType.toLowerCase();
    self.NetworkUpdated.emit(self.networkName);
    console.log("zavrsio");
  }
  
  private successGetStatisticsCallback(self: any, metadata: any){
    self.metadata = metadata;
    console.log(metadata)
  }
  
  
  
  public StartTraining() {
    if(this.neuralNetwork.conf.problemType == 'regression'){
      //this.testBarplot.text1 = "MSE";
      //this.testBarplot.text2 = "MAE";
    }
    else{
      //this.testbarplotdva.text1 = "Precision";
      //this.testbarplotdva.text2 = "Recall";
    }
    
    this.runningTraining = true;
    this.wsService.train(this.getProjectId(), this.getNetworkId(), this.neuralNetwork.conf, this, this.updateTrainData, this.finishedCallback);
  }
  
  
  updateTrainData(self: ExperimentNetworkComponent, epochs: any) {
    
    for (const epoch of epochs) {
      self.grafik.dataUpdate(epoch['epoch'], epoch['val_loss'], epoch['loss']);
      
      if(self.neuralNetwork.conf.problemType == 'regression'){
        if(self.testBarplot != undefined){
          self.testBarplot.text1 = "MSE";
          self.testBarplot.text2 = "MAE";
        
        self.MSEbarplot.RefreshBarplot(epoch['mean_squared_error'], epoch['val_mean_squared_error'])
        self.MAEbarplot.RefreshBarplot(epoch['mean_absolute_error'], epoch['val_mean_absolute_error'])
      }
      }
      else{
        if(self.testbarplotdva != undefined){
          self.testbarplotdva.text1 = "Precision";
          self.testbarplotdva.text2 = "Recall";
        
        //self.categoricalbarplot.RefreshBarplot(epoch['categorical_accuracy'], epoch['val_categorical_accuracy'])
        self.precisionbarplot.RefreshBarplot(epoch['precision'], epoch['val_precision'])
        self.recallbarplot.RefreshBarplot(epoch['recall'], epoch['val_recall'])
      }
      }
    }

  }
  
  public finishedCallback(self: ExperimentNetworkComponent){
    self.nnService.getTrainRez(self.getProjectId(), self.getNetworkId(), self, self.gotTrainRez);
  }
  
  
  public gotTrainRez(self: ExperimentNetworkComponent, response: any){
    if(self.neuralNetwork.conf.problemType == 'regression'){
      if(self.testBarplot != undefined)
        self.testBarplot.RefreshBarplot(response[0]['mean_squared_error'], response[0]['mean_absolute_error'])
    }
    else{
      if(self.testbarplotdva != undefined)
        self.testbarplotdva.RefreshBarplot(response[0]['precision'], response[0]['recall'])
    }
  }
  
  
  public ChangeNetworkTitle(title: string){
    console.log(title)
    this.nnService.changeNNTitle(this.getProjectId(), this.getNetworkId(), title);
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
