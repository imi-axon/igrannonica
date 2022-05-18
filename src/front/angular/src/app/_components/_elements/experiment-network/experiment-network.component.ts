import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NeuralNetwork, Project } from 'src/app/_utilities/_data-types/models';
import { TrainingApiService } from 'src/app/_utilities/_middleware/training-api.service';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
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
    private datasetServie: DatasetService,
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
  public neuralNetwork : NeuralNetwork = 
  {
    "nn": {
      "layers": [
        
        // LAYER 1 - 3 NEURONA
        {
          "neurons": [
            {
              "weights": [
                
              ],
              "bias": 2.1
            },
            {
              "weights": [
                
              ],
              "bias": 2.9
            },
            {
              "weights": [
                
              ],
              "bias": 3.4
            }
          ]
        },
        
        // LAYER 2 - 2 NEURONA
        {
          "neurons": [
            {
              "weights": [
                7.18,
                -3.64,
                -7.8
              ],
              "bias": 3.11
            },
            {
              "weights": [
                3.88,
                5.2,
                -5.47
              ],
              "bias": 1.2
            }
          ]
        },
        
        // OUTPUT - 2 NEURONA
        {
          "neurons": [
            
          ]
        }
      ]
    },
    "conf":
    {
      "inputs": [],
      "outputs": [],
      
      "neuronsPerLayer": [3, 2, 0],
      
      "actPerLayer": ["Linear", "Sigmoid"],
      "actOut": "ReLU",
      
      "learningRate": 0.03,
      "reg": "None",
      "regRate": 0,
      "batchSize": 16,
      
      "problemType": "classification",
      
      "splitType": "sequential",
      "trainSplit": 0.3,
      "valSplit": 0.4
    }
  }
  
  public runningTraining: Boolean = false;
  
  public unusedColumns: string[] = [];
  public selectedColumns: string[] = [];
  
  

  ngOnInit(): void {
    
    this.datasetServie.GetDatasetPage(this.getProjectId(), true, 1, 1, this, this.successDatasetCallback)
  }
  
  private successDatasetCallback(self: any, response : any){
    self.unusedColumns = Object.keys(JSON.parse(JSON.parse(response.dataset).dataset)[0])
  }
  
  
  
  
  
  
  
  
  public StartTraining() {
    console.log(this.neuralNetwork)
    
    
    
    this.runningTraining = true;
    this.wsService.train(this.getProjectId(), this.getNetworkId(), this.neuralNetwork.conf, this, this.updateTrainData);
  }
  
  
  updateTrainData(self: ExperimentNetworkComponent, data: any) {
    let tLoss = data['t_loss'];
    let vLoss = data['v_loss'];
    let ep = data['epoch'];
    
    self.grafik.dataUpdate(ep, tLoss, vLoss)
    //self.konfiguracija.epoch=ep;
  }
  
    /*
    let neuronsPerLayer : number [] = [];
    for(let i = 0; i < this.nnDisplay.network.layers.length - 1; i++)
      neuronsPerLayer.push(this.nnDisplay.network.layers[i].neurons.length)
    
    console.log(neuronsPerLayer)
      
    console.log("podaci:"
      + "\n" + this.konfiguracija.learningRate
      + "\n" + this.konfiguracija.regularization
      + "\n" + this.konfiguracija.regularizationRate
      + "\n" + this.konfiguracija.batchSize
      + "\n" + this.konfiguracija.inputs
      + "\n" + this.konfiguracija.outputs
      
      // Dodato
      + "\n" + neuronsPerLayer
      
      + "\n" + this.konfiguracija.activation);
      
    let conf = {
      inputs: this.konfiguracija.inputs, //str[]
      outputs: this.konfiguracija.outputs, //str[]
      
      // Dodato
      neuronsPerLayer: neuronsPerLayer, //int[]
      
      actPerLayer: ['sigmoid', 'sigmoid'], //str[]
      
      // Dodato
      actOut: "", //str
      
      learningRate: this.konfiguracija.learningRate, //float
      reg: this.konfiguracija.regularization, //str
      regRate: this.konfiguracija.regularizationRate, //float
      batchSize: this.konfiguracija.batchSize //int
      
      // Dodato
      ,
      trainSplit:this.konfiguracija.trainSplit,
      valSplit:this.konfiguracija.valSplit,
      testSplit:this.konfiguracija.testSplit
     // trainSplit: 0.5, // float
     // valSplit: 0.5 // float
    };
    
    console.log('--- KONFIGURACIJA ---')
    console.log(conf)
    this.wsService.train(this.projectId, this.nnId, conf, this, this.addTrainData);

    console.log(this.konfiguracija.valSplit);

    addTrainData(self: TrainingPageComponent, data: any) {
      let tLoss = data['t_loss'];
      let vLoss = data['v_loss'];
      let ep = data['epoch'];

      self.grafik.dataUpdate(ep, tLoss, vLoss)
      self.konfiguracija.epoch=ep;
    }
  */
  
  
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
