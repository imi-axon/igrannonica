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
  public display: ElementRef;
  
  @ViewChild("networkComponent")
  private networkComponent: NeuralNetworkDisplayComponent;
  
  @ViewChild("changeInputOutputWindow")
  private changeInputOutputWindow: ElementRef;
  
  
  
  // NEURAL NETWORK
  public neuralNetwork = 
  {
    "nn": {
      "layers": [
        
        // LAYER 1 - 3 NEURONA
        {
          "neurons": [
            {
              "weights": [
                1, -3.47, 1
              ],
              "bias": 2.1
            },
            {
              "weights": [
                5, -2.78, 3.15
              ],
              "bias": 2.9
            },
            {
              "weights": [
                1.54, 1.15, -2.0
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
            {
              "weights": [
                4.28,
                -1.2
              ],
              "bias": 1.71
            },
            {
              "weights": [
                7.2,
                6.13
              ],
              "bias": 3.11
            }
          ]
        }
      ]
    },
    "conf":
    {
      "inputs": ["A INPUT", "B INPUT", "C INPUT"],
      "outputs": ["Z OUTPUT", "Y OUTPUT"],
      
      "neuronsPerLayer": [3, 2, 2],
      
      "actPerLayer": ["Linear", "Sigmoid"],
      "actOut": "ReLU",
      
      "learningRate": 0.03,
      "reg": "None",
      "regRate": 0,
      "batchSize": 1,
      
      "problemType": "classification",
      
      "splitType": "random",
      "trainSplit": 0.5,
      "valSplit": 0.5
    }
  }
  
  public unusedColumns: string[] = ["UNUSED G", "UNUSED H", "UNUSED I", "UNUSED J"];
  
  public selectedInputs: boolean[] = [];
  public selectedUnused: boolean[] = [];
  public selectedOutputs: boolean[] = [];
  
  
  private getProjectId(): number{
    let p = this.activatedRoute.parent?.snapshot.paramMap.get("ProjectId");
    if (p != null)  {
      return Number.parseInt(p);
    }
    return -1;
  }
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ResetSelectedInputs();
    this.ResetSelectedUnused();
    this.ResetSelectedOutputs();
  }
  
  private ResetSelectedInputs(){
    this.selectedInputs = this.neuralNetwork.conf.inputs.map(() => false)
  }
  private ResetSelectedUnused(){
    this.selectedUnused = this.unusedColumns.map(() => false)
  }
  private ResetSelectedOutputs(){
    this.selectedOutputs = this.neuralNetwork.conf.outputs.map(() => false)
  }
  
  
  public SelectDeselectInput(index: number){
    this.selectedInputs[index] = !this.selectedInputs[index];
  }
  public SelectDeselectUnused(index: number){
    this.selectedUnused[index] = !this.selectedUnused[index];
  }
  public SelectDeselectOutput(index: number){
    this.selectedOutputs[index] = !this.selectedOutputs[index];
  }
  
  
  
  
  
  
  
  
  
  // MOVING SELECTION
  
  private countSelected(array: boolean[]){
    let seletedCount = 0;
    for(let i = 0; i < array.length; i++)
      if(array[i])
        seletedCount++;
    return seletedCount;
  }
  
  // INPUTS TO UNUSED
  public MoveInputsToUnused(){
    if(this.countSelected(this.selectedInputs) < this.selectedInputs.length){
      for(let i = this.selectedInputs.length - 1; i >= 0; i--)
        if(this.selectedInputs[i]){
          this.unusedColumns.push(this.neuralNetwork.conf.inputs[i]);
          this.networkComponent.RemoveInputClick(this.neuralNetwork.conf.inputs[i]);
          this.selectedInputs[i] = false;
        }
    }
    else
      return;
    
      
    this.ResetSelectedInputs();
    this.ResetSelectedUnused();
  }
  
  // UNUSED TO INPUTS
  public MoveUnusedToInputs(){
    for(let i = this.selectedUnused.length - 1; i >= 0; i--)
      if(this.selectedUnused[i]){
        this.networkComponent.AddColumnToInput(this.unusedColumns[i]);
        this.unusedColumns.splice(i, 1);
        this.selectedInputs[i] = false;
      }
    
    this.ResetSelectedInputs();
    this.ResetSelectedUnused();
  }
  
  // UNUSED TO OUTPUTS
  public MoveUnusedToOutputs(){
    for(let i = this.selectedUnused.length - 1; i >= 0; i--)
      if(this.selectedUnused[i]){
        this.networkComponent.AddColumnToOutput(this.unusedColumns[i]);
        this.unusedColumns.splice(i, 1);
      }
    
    this.ResetSelectedInputs();
    this.ResetSelectedUnused();
  }
  
  // OUTPUTS TO UNUSED
  public MoveOutputsToUnused(){
    if(this.countSelected(this.selectedOutputs) < this.selectedOutputs.length){
      for(let i = this.selectedOutputs.length - 1; i >= 0; i--)
        if(this.selectedOutputs[i]){
          this.unusedColumns.push(this.neuralNetwork.conf.outputs[i]);
          this.networkComponent.RemoveOutputClick(this.neuralNetwork.conf.outputs[i]);
        }
    }
    else
        return;
        
    this.ResetSelectedOutputs();
    this.ResetSelectedUnused();
  }
  
  
  // INTPUT OUTPUT WINDOW CONTROLS
  public OpenChangeInputOutputWindow(){
    this.changeInputOutputWindow.nativeElement.setAttribute("style", "display: block;");
  }
  
  public CloseChangeInputOutputWindow(){
    this.changeInputOutputWindow.nativeElement.setAttribute("style", "display: none;");
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
