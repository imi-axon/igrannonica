import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Query, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeuralNetwork, Project } from 'src/app/_utilities/_data-types/models';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { LoaderService } from 'src/app/_utilities/_services/loader.service';
import { NetworkService } from 'src/app/_utilities/_services/network.service';
import { NnService } from 'src/app/_utilities/_services/nn.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';
import { TrainingService } from 'src/app/_utilities/_services/training.service';
import { ChartTrainingComponent } from '../chart-training/chart-training.component';
import { MetricsBarplotComponent } from '../metrics-barplot/metrics-barplot.component';
import { NeuralNetworkDisplayComponent } from '../neural-network-display/neural-network-display.component';

@Component({
  selector: 'app-experiment-network',
  templateUrl: './experiment-network.component.html',
  styleUrls: ['./experiment-network.component.scss']
})
export class ExperimentNetworkComponent implements OnInit, AfterContentInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private nnService: NnService,
    private statisticsService: StatisticsService,
    private networkService: NetworkService,
    private wsService: TrainingApiService,
    public loaderService:LoaderService,
    private trainingService:TrainingService
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
  
  
  
  @ViewChildren(MetricsBarplotComponent)
  public metricComponents: QueryList<MetricsBarplotComponent>;

  
  // NEURAL NETWORK
  public networkName: string = "";
  public neuralNetwork : NeuralNetwork = new NeuralNetwork();
  public runningTraining: boolean = false;
  public trenirana : boolean = false;
  public resetButton: boolean = false;
  public prikazGrafa: boolean = false;
  
  public unusedColumns: string[] = [];
  public selectedColumns: string[] = [];
  
  private metadata: any;
  private once: boolean = true;

  ngOnInit(): void {
    this.trainingService.isTraining(this.getProjectId(), this.getNetworkId(), this,this.successCallbackIsTraining);
  }
  
  ngAfterContentInit(){
    this.statisticsService.GetStatistics(this.getProjectId(), true, this, this.successGetStatisticsCallback);
    
    this.nnService.getTrainRez(this.getProjectId(), this.getNetworkId(), this, this.gotPreviousRez);
  }
  
  private gotPreviousRez(self: any, epochs: any){
    self.metricComponents.changes.subscribe((component: any) => { self.MetricComponentsLoaded(self, epochs); }); 
  }
  
  private MetricComponentsLoaded(self: any, epochs: any){
    setTimeout(() => {
      console.log(epochs)
      
      self.metricComponents.forEach((component: MetricsBarplotComponent) => {
        component.UpdateBarplot(epochs[epochs.length - 1][component.title], epochs[epochs.length - 1]['val_' + component.title]);
        component.FinishBarplot(epochs[0][component.title]);
      });
      
      console.log(self.grafik)
      for(let i = 2; i < epochs.length; i++)
        self.grafik.dataUpdate(epochs[i]['epoch'], epochs[i]['val_loss'], epochs[i]['loss']);
      
      self.trenirana = true;
    }, 0);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  private successGetNetworkCallback(self: any, response: any){
    // console.log("uspesno network");
    //self.unusedColumns = Object.keys(JSON.parse(JSON.parse(response.dataset).dataset)[0])
    self.networkName = response.name;
    self.neuralNetwork = new NeuralNetwork();
    self.neuralNetwork.conf = JSON.parse(response.conf);
    self.neuralNetwork.nn = JSON.parse(JSON.parse(response.nn).nn);
    // console.log(self.neuralNetwork);
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
    // console.log("zavrsio");
  }
  
  private successGetStatisticsCallback(self: any, metadata: any){
    self.metadata = metadata;

    self.networkService.GetNetwork(self.getProjectId(), self.getNetworkId(), self, self.successGetNetworkCallback);
    // console.log(metadata)
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
    this.prikazGrafa=true;
    this.resetButton=true;
    this.trenirana=true;
    this.wsService.train(this.getProjectId(), this.getNetworkId(), this.neuralNetwork.conf, this, this.updateTrainData, this.finishedCallback);
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  updateTrainData(self: ExperimentNetworkComponent, epochs: any) {
    for (const epoch of epochs) {
      self.grafik.dataUpdate(epoch['epoch'], epoch['val_loss'], epoch['loss']);
      
      self.metricComponents.forEach(component => {
        component.UpdateBarplot(epoch[component.title], epoch['val_' + component.title]);
      });
    }
    self.grafik.chartUpdate()
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  public finishedCallback(self: ExperimentNetworkComponent){
    self.resetButton=false;
    self.runningTraining = false;
    self.nnService.getTrainRez(self.getProjectId(), self.getNetworkId(), self, self.gotTrainRez);
    
    self.networkService.GetNetwork(self.getProjectId(), self.getNetworkId(), self, self.successGetNetworkCallback);
    //console.log("zavrseno");
  }
  
  public gotTrainRez(self: ExperimentNetworkComponent, response: any){
    self.metricComponents.forEach(component => {
      component.FinishBarplot(response[0][component.title]);
    });
  }

  public successCallbackIsTraining(self:any, res:any){
    console.log(res.isTraining);
    if(res.isTraining==true)
      self.StartTraining();
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  public ChangeNetworkTitle(title: string){
    // console.log(JSON.stringify(title).slice(1, JSON.stringify(title).length - 1))
    this.nnService.changeNNTitle(this.getProjectId(), this.getNetworkId(), JSON.stringify(title).slice(1, JSON.stringify(title).length - 1));
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

  public prikaziMrezu(){
    // console.log("reset");
    this.prikazGrafa=false;
  }

  public prikaziGrafik(){
    console.log("reset");
    this.prikazGrafa=true;
  }

  public StopTraining(){
    console.log("stop");
    this.resetButton=false;
    this.runningTraining=false;
    this.trainingService.stopTrain(this.getProjectId(), this.getNetworkId(), this, this.stopCallback);
  }

  public stopCallback(self: any){
    // console.log("stop callback");
  }

}
