import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { select } from 'd3';
import { fromEvent, Subscription } from 'rxjs';
import { ExperimentNetworkComponent } from '../experiment-network/experiment-network.component';

const MIN_CLAMP_OUT = 1;
const MAX_CLAMP_OUT = 6;

@Component({
  selector: 'app-neural-network-display',
  templateUrl: './neural-network-display.component.html',
  styleUrls: ['./neural-network-display.component.scss']
})
export class NeuralNetworkDisplayComponent implements OnInit {
  constructor() { }
  private subscription: Subscription;
    
  @ViewChild("container")
  container: ElementRef;
  
  @ViewChild("weightInput")
  weightInput: ElementRef;
  
  @Input() parent: ExperimentNetworkComponent;
  
  private possibleActivations: string[] = ["Linear", "Sigmoid", "ReLU", "Tahn", "Tralala"];
  private defaultActivation: string = "Linear";
  
  private weightInputShown: boolean = false;
  private weightInputId: string = "weightInput";
  private weightToChange: any = { "layerIndex": -1, "neuronIndex": -1, "weightIndex": -1 }
  
  
  // Parametri
  private displayWidth: number = 0;
  private displayHeigth: number = 0;
  private displayTopPadding: number = 200;
  
  private layerWidth: number = 200;
  
  private neuronOffsetY: number = 100;
  private neuronWidth: number = 50;
  
  // GROUPS
  private d3Container: any;
  
  private inputLayer: any;
  private inputNeurons: any;
  
  private outputLayer: any;
  private outputNeurons: any;
  
  private layers: any;
  private neurons: any;
  
  private connections: any;
  
  private inputConnections: any;
  
  private outputConnections: any;
  
  private addNeuronButtons: any;
  private addLayerButtons: any;
  
  private actPerLayerCombos: any;
  private outputActivationComboDiv: any;
  
  private editInputOutputButtons: any;
  
  
  private Clamp(value: number): number{
    let clampedValue = Math.abs(value / 3);
    if (clampedValue <= MIN_CLAMP_OUT)
      return MIN_CLAMP_OUT;
    if (clampedValue >= MAX_CLAMP_OUT)
      return MAX_CLAMP_OUT;
    return clampedValue;
  }
  
  // INIT FUNCTION
  ngOnInit(): void {
    setTimeout(() => {
      
      this.subscription = fromEvent(document, 'mouseup').subscribe( e => { this.mouseUpHandler(e as MouseEvent); });
      this.Refresh();
      
    }, 0);
  }
  
  // Global Events
  private mouseUpHandler(event: MouseEvent){
    if(!this.weightInputShown || (event.target as any).id == this.weightInputId)
      return;
    
    this.weightInput.nativeElement.setAttribute("style", "display: none;");
    this.weightInputShown = false;
  }
  
  
  
  // DISPLAY REFRESHER - call after every nn change
  public Refresh(){
    this.displayWidth = (this.parent.neuralNetwork.nn.layers.length + 1) * this.layerWidth;
    this.displayHeigth = (this.caluculateMaxVerticalNeurons() + 1) * this.neuronOffsetY + this.displayTopPadding;
    
    if(this.container.nativeElement.clientHeight  - 17 > this.displayHeigth)
      this.displayHeigth = this.container.nativeElement.clientHeight;
    
    select("svg .d3Container").selectChildren().remove();
    select("#activationCombos").selectChildren().remove();
    select("#outputActivationCombo").selectChildren().remove();
    select("#editInputOutputButtons").selectChildren().remove();
    
    this.d3Init();
    this.d3Setup();
    
  }
  
  // MAIN SVG FUNCTIONS
  private caluculateMaxVerticalNeurons(): number{
    let maxNeurons = 0;
    
    for(var i = 0; i < this.parent.neuralNetwork.nn.layers.length; i++)
        if(this.parent.neuralNetwork.nn.layers[i].neurons.length >= maxNeurons)
            maxNeurons = this.parent.neuralNetwork.nn.layers[i].neurons.length;
    
    if(this.parent.neuralNetwork.conf.inputs.length > maxNeurons)
      maxNeurons = this.parent.neuralNetwork.conf.inputs.length;
    
    return maxNeurons;
  }
  private calculateCurrentYOffset(layerNeuronCount: number): number{
    return (this.caluculateMaxVerticalNeurons() - layerNeuronCount) * 0.5 * this.neuronOffsetY;
  }
  
  
  
  
  
  
  
  
  // NETWORK CONTROLS ==========================================================
  
  
  public RemoveInputClick(inputName: string){
    if(this.parent.neuralNetwork.conf.inputs.length <= 1)
      return;
    
    let inputIndex = -1;
    this.parent.neuralNetwork.conf.inputs.forEach(
      (element: string,index: number)=>{
        if(element == inputName) {
          this.parent.neuralNetwork.conf.inputs.splice(index, 1);
          inputIndex = index;
        }
      }
    );
    
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[0].neurons.length; i++)
      this.parent.neuralNetwork.nn.layers[0].neurons[i].weights.splice(inputIndex, 1);
    
   
    this.Refresh();
  }
  public RemoveOutputClick(outputName: string){
    if(this.parent.neuralNetwork.conf.outputs.length <= 1)
      return;
    
    let outputIndex = -1;
    // Remove input name from conf
    this.parent.neuralNetwork.conf.outputs.forEach(
      (element: string,index: number)=>{
        if(element == outputName) {
          outputIndex = index;
          this.parent.neuralNetwork.conf.outputs.splice(index, 1);
        }
      }
    );
    
    // Remove input neuron from last layer in nn
    this.parent.neuralNetwork.nn.layers[this.parent.neuralNetwork.nn.layers.length - 1].neurons.forEach(
      (element: any,index: number)=>{
        if(index == outputIndex) {
          this.parent.neuralNetwork.nn.layers[this.parent.neuralNetwork.nn.layers.length - 1].neurons.splice(index, 1);
        }
      }
    );
   
    this.Refresh();
  }
  
  public AddColumnToInput(columnName: string){
    this.parent.neuralNetwork.conf.inputs.push(columnName);
    
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[0].neurons.length; i++)
      this.parent.neuralNetwork.nn.layers[0].neurons[i].weights.push(1);
    
    this.Refresh();
  }
  public AddColumnToOutput(columnName: string){
    this.parent.neuralNetwork.conf.outputs.push(columnName);
    
    let weights: number[] = [];
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[this.parent.neuralNetwork.nn.layers.length - 2].neurons.length; i++)
      weights.push(1);
    
    this.parent.neuralNetwork.nn.layers[this.parent.neuralNetwork.nn.layers.length - 1].neurons.push(
      {
        "weights": weights,
        "bias": 1
      }
    );
    
    this.Refresh();
  }
  
  
  
  private AddNeuronToLayer(layerIndex: any){
    let weights: number[] = [];
    
    // Popuni tezine trenutnog neurona neuronima prethodnog sloja ili ulaza
    if(layerIndex == 0)
      for(let i = 0; i < this.parent.neuralNetwork.conf.inputs.length; i++)
        weights.push(1);
    else
      for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex - 1].neurons.length; i++)
        weights.push(1);
    
    // Dodaj u tezine neurona sledeceg sloja ovaj neuron
    if(layerIndex < (this.parent.neuralNetwork.nn.layers.length - 1))
      for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons.length; i++)
        this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons[i].weights.push(1);
    
    
    this.parent.neuralNetwork.nn.layers[layerIndex].neurons.push(
      {
        "weights": weights,
        "bias": 1
      }
    )
    
    this.parent.neuralNetwork.conf.neuronsPerLayer[layerIndex]++;
    
    this.Refresh();
  } 
  private RemoveHiddenClick(layerIndex: number, neuronIndex: any){
    
    if(this.parent.neuralNetwork.nn.layers.length <= 2 && this.parent.neuralNetwork.nn.layers[0].neurons.length <= 1)
      return;
    
    // Is current layer going to be empty after neuron deletion
    if(this.parent.neuralNetwork.nn.layers[layerIndex].neurons.length <= 1){
        
      
      // If first hidden layer is going to be removed connect next to input
      if(layerIndex == 0){
        
        for(let i = 0; i < this.parent.neuralNetwork.nn.layers[1].neurons.length; i++){
          this.parent.neuralNetwork.nn.layers[1].neurons[i].weights = [];
          for(let j = 0; j < this.parent.neuralNetwork.conf.inputs.length; j++)
            this.parent.neuralNetwork.nn.layers[1].neurons[i].weights.push(1);
        }
        
      }
      
      
      // Otherwise connect previous to next / last hidden (output)
      else
      {
        
        for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons.length; i++){
          this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons[i].weights = [];
          for(let j = 0; j < this.parent.neuralNetwork.nn.layers[layerIndex - 1].neurons.length; j++)
            this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons[i].weights.push(1)
        }
        
      }
      
      // Remove current empty layer
      this.parent.neuralNetwork.nn.layers.splice(layerIndex, 1);
      
      // Remove act from actPerLayer - in conf
      this.parent.neuralNetwork.conf.actPerLayer.splice(layerIndex, 1);
      
      this.parent.neuralNetwork.conf.neuronsPerLayer.splice(layerIndex, 1);
    }
    
    else{
      
      // Remove connections from next layer
      for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons.length; i++){
        this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons[i].weights.splice(neuronIndex, 1);
      }
      
      // Remove neuron from current layer
      this.parent.neuralNetwork.nn.layers[layerIndex].neurons.splice(neuronIndex, 1);
      
      this.parent.neuralNetwork.conf.neuronsPerLayer[layerIndex]--;
    }
    
    this.Refresh();
  }

  
  
  public AddLayerAtIndex(layerIndex: number){
    let weights : number[] = [];
    
    // If first layer added get weigths by input
    if(layerIndex == 0)
      for(let i = 0; i < this.parent.neuralNetwork.conf.inputs.length; i++)
        weights.push(1);
    
    // If other layer get weights by previous layer
    else
      for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex - 1].neurons.length; i++)
        weights.push(1);
    
    // Make new layer
    let newLayer: any = { "neurons": [{ "weights": weights, "bias": 1 }] }
    
    
    let layerCount = this.parent.neuralNetwork.nn.layers.length;
    // Push last element 1 space to right (adding space for new layer)
    this.parent.neuralNetwork.nn.layers.push(this.parent.neuralNetwork.nn.layers[layerCount - 1]);
    
    // Update length
    layerCount += 1;
    
    // Move neurons after new layer future position 1 space to the right
    for(let i = layerCount - 3; i >= layerIndex; i--)
      this.parent.neuralNetwork.nn.layers[i + 1] = this.parent.neuralNetwork.nn.layers[i];
    
    // Place new layer at desired position
    this.parent.neuralNetwork.nn.layers[layerIndex] = newLayer;
    
    
    // Fix next layer weights to current layer neuron
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons.length; i++){
      this.parent.neuralNetwork.nn.layers[layerIndex + 1].neurons[i].weights = [1];
    }
    
    
    // FIX ACT PER LAYER =======================
    
    let actCount = this.parent.neuralNetwork.conf.actPerLayer.length;
    // Update actPerLayer
    this.parent.neuralNetwork.conf.actPerLayer.push(this.parent.neuralNetwork.conf.actPerLayer[actCount - 1])
    
    actCount += 1;
    
    for(let i = actCount - 3; i >= layerIndex; i--)
      this.parent.neuralNetwork.conf.actPerLayer[i + 1] = this.parent.neuralNetwork.conf.actPerLayer[i];
    
    this.parent.neuralNetwork.conf.actPerLayer[layerIndex] = this.defaultActivation;
    
    // FIX NEURONS PER LAYER
    
    let nplCount = this.parent.neuralNetwork.conf.neuronsPerLayer.length;
    this.parent.neuralNetwork.conf.neuronsPerLayer.push(this.parent.neuralNetwork.conf.neuronsPerLayer[nplCount - 1])
    
    nplCount += 1;
    
    for(let i = nplCount - 3; i >= layerIndex; i--)
      this.parent.neuralNetwork.conf.neuronsPerLayer[i + 1] = this.parent.neuralNetwork.conf.neuronsPerLayer[i];
      
    this.parent.neuralNetwork.conf.neuronsPerLayer[layerIndex] = 1
    
    
    this.Refresh();
  }
  
  
  
  public ShowWeightChangeInput(event: MouseEvent, layerIndex: number, neuronIndex: number, weightIndex: number){
    
    let relativeClickPosition : any = {
      x: event.x - this.container.nativeElement.offsetLeft + this.parent.display.nativeElement.scrollLeft,
      y: event.y - this.container.nativeElement.offsetTop + this.parent.display.nativeElement.scrollTop
    }
    
    this.weightInput.nativeElement.setAttribute("style", "display: block; left: " + relativeClickPosition.x + "px; top: " + relativeClickPosition.y + "px");
    this.weightInput.nativeElement.value = this.parent.neuralNetwork.nn.layers[layerIndex].neurons[neuronIndex].weights[weightIndex];
    
    this.weightToChange = {
      "layerIndex": layerIndex,
      "neuronIndex": neuronIndex,
      "weightIndex": weightIndex
    }
    
    this.weightInputShown = true;
  }
  public ChangeNetworkWeight(event: any){
    this.parent.neuralNetwork.nn.layers[this.weightToChange.layerIndex].neurons[this.weightToChange.neuronIndex].weights[this.weightToChange.weightIndex] = event.target.value;
  }
  
  
  
  private ChangeActivationForLayer(value: string, layerIndex: number){
    this.parent.neuralNetwork.conf.actPerLayer[layerIndex] = value;
  }
  private ChangeOutputActivation(value: string){
    this.parent.neuralNetwork.conf.actOut = value;
  }
  
  
  private ShowChangeInputOutputWindow(){
    this.parent.OpenChangeInputOutputWindow();
  }
  
  // END OF NETWORK CONTROLS ===================================================
  
  
  
  
  
  
  
  
  private d3Init(){
    // SVG setup
     select("svg")
      .attr("width", this.displayWidth)
      .attr("height", this.displayHeigth);
    
    this.d3Container = select("svg")
      .select(".d3Container")
    
    // Input Layer
    this.inputLayer = this.d3Container
    .append("g")
    .classed("inputLayer", true);
    
    // Output Layer
    this.outputLayer = this.d3Container
      .append("g")
      .classed("outputLayer", true);
    
    // Layer group
    this.layers = this.d3Container
      .append("g")
      .classed("layers", true);
    
    // Connections
    this.connections = this.d3Container
      .append("g")
      .classed("connections", true)
    
    // Input Connections
    this.inputConnections = this.d3Container
      .append("g")
      .classed("inputConnections", true)
    
    // Output Connections
    this.outputConnections = this.d3Container
      .append("g")
      .classed("outputConnections", true)
    
    // Hidden neurons
    this.neurons = this.d3Container
      .append("g")
      .classed("neurons", true)
    
    // Input Neurons
    this.inputNeurons = this.d3Container
      .append("g")
      .classed("inputNeurons", true);
    
    // Output Neurons
    this.outputNeurons = this.d3Container
      .append("g")
      .classed("outputNeurons", true);
    
      
    // Add neuron buttons
    this.addNeuronButtons = this.d3Container
      .append("g")
      .classed("addNeuronButtons", true)
      
      
    // Add layer buttons
    this.addLayerButtons = this.d3Container
      .append("g")
      .classed("addLayerButtons", true)
    
    // Add actPerLayer combo buttons
    this.actPerLayerCombos = select("#activationCombos")
    
    this.outputActivationComboDiv = select("#outputActivationCombo");
    
    this.editInputOutputButtons = select("#editInputOutputButtons");
    
  }
  
  private d3Setup(){
    this.AddInputLayer();
    this.AddOutputLayer();
    this.AddHiddenLayers();
    
    this.AddInputNeurons();
    this.AddOuputNeurons();
    this.AddHiddenNeurons();
    this.AddConnections();
    this.AddInputConnections();
    this.AddOutputConnections();
    
    this.AddNeuronButtons();
    this.AddLayerButtons();
    
    this.AddActivationCombos();
    this.AddOutputActivationCombo();
    
    this.AddEditInputOutputButtons();
  }
  
  
  
  
  
  private AddInputLayer(){
    this.inputLayer
      .append("rect")
      .classed("layerRect", true)
      .attr("y", 0)
      .attr("width", this.layerWidth)
      .attr("height", "100%")
      .attr("fill-opacity", 0)
      .transition()
        .duration(500)
        .attr("x", 0)
    
    this.inputLayer
      .append("text")
      .text("Input")
      .attr("y", 30)
      .attr("x", this.layerWidth / 2)
      .classed("layerTitle", true)
  }
  private AddOutputLayer(){
    this.outputLayer
      .append("rect")
      .classed("layerRect", true)
      .attr("y", 0)
      .attr("x", this.parent.neuralNetwork.nn.layers.length * this.layerWidth)
      .attr("width", this.layerWidth)
      .attr("height", "100%")
      .attr("fill-opacity", 0)
    
    this.outputLayer
      .append("text")
      .text("Output")
      .attr("y", 30)
      .attr("x", this.parent.neuralNetwork.nn.layers.length * this.layerWidth + (this.layerWidth / 2))
      .classed("layerTitle", true)
  }
  
  private AddHiddenLayers(){
    
    // Layer rects
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers.length - 1; i++)
      this.layers
        .append("rect")
        .classed("layerRect", true)
        .attr("x", (i + 1) * this.layerWidth)
        .attr("y", 0)
        .attr("height", "100%")
        .attr("width", this.layerWidth)
        .attr("fill-opacity", 0)
    
    // Layer texts
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers.length - 1; i++)
      this.layers
        .append("text")
        .classed("layerTitle", true)
        .text("Layer " + (i + 1))
        .attr("y", 30)
        .attr("x", (i + 1) * this.layerWidth + this.layerWidth / 2);
  
  }
  
  
  

  private AddInputNeurons(){
    
    this.inputNeurons.selectAll("circle")
      .data(this.parent.neuralNetwork.conf.inputs)
      .enter()
        .append("circle")
        .classed("neuron", true)
        .attr("cy", (d: any, i: number) => {return i * this.neuronOffsetY + this.displayTopPadding + this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.inputs.length)})
        .attr("cx", this.layerWidth / 2)
        .attr("cursor", "pointer")
        
        .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("r", (this.neuronWidth / 2) + 2)
        })
        .on("mouseout", (event : any, d : any) => {
            select(event.currentTarget)
                .transition()
                .duration(250)
                .attr("r", (this.neuronWidth / 2))
        })
        /*
        .on("click", (event : any, d : any) => {
          this.RemoveInputClick(d);
        })
        */
        .transition()
        .duration(50)
          .attr("r", this.neuronWidth / 2)
      
    this.inputNeurons.selectAll("text")
      .data(this.parent.neuralNetwork.conf.inputs)
      .enter()
        .append("text")
        .classed("label", true)
        .text((d: any) => {return d;})
        .attr("y", (d: any, i: number) => { return i * this.neuronOffsetY + this.displayTopPadding + this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.inputs.length) - (this.neuronWidth / 2) - 10})
        .attr("x", this.layerWidth / 3)
          
  }
  
  private AddHiddenNeurons(){
        
    // Layer neurons
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers.length - 1; i++)
      for(let j = 0; j < this.parent.neuralNetwork.nn.layers[i].neurons.length; j++)
        this.neurons
          .append("circle")
          .classed("neuron", true)
          .attr("cy", this.displayTopPadding + j * this.neuronOffsetY + this.calculateCurrentYOffset(this.parent.neuralNetwork.nn.layers[i].neurons.length) )
          .attr("cx", (i + 1) * this.layerWidth + this.layerWidth / 2 )
          .attr("cursor", "pointer")
          .on("mouseenter", (event : any, d : any) => {
              select(event.currentTarget)
                  .transition()
                  .duration(250)
                  .attr("r", (this.neuronWidth / 2) + 2)
          })
          .on("mouseout", (event : any, d : any) => {
              select(event.currentTarget)
                  .transition()
                  .duration(250)
                  .attr("r", (this.neuronWidth / 2))
          })
          .on("click", (event : any, d : any) => {
            this.RemoveHiddenClick(i, j);
          })  
          .transition()
          .duration(250)
            .attr("r", this.neuronWidth / 2)
            
  }
  
  private AddOuputNeurons(){
    
    this.outputNeurons.selectAll("circle")
      .data(this.parent.neuralNetwork.conf.outputs)
      .enter()
        .append("circle")
        .classed("neuron", true)
        .attr("cy", (d: any, i: number) => {return i * this.neuronOffsetY + this.displayTopPadding + this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.outputs.length)})
        .attr("cx", (this.parent.neuralNetwork.nn.layers.length) * this.layerWidth + (this.layerWidth / 2))
        .attr("cursor", "pointer")
        
        .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("r", (this.neuronWidth / 2) + 2)
        })
        .on("mouseout", (event : any, d : any) => {
            select(event.currentTarget)
                .transition()
                .duration(250)
                .attr("r", (this.neuronWidth / 2))
        })
        /*
        .on("click", (event : any, d : any) => {
          this.RemoveOutputClick(d);
        })  
        */
        
        .transition()
        .duration(500)
          .attr("r", this.neuronWidth / 2)
      
    this.outputNeurons.selectAll("text")
      .data(this.parent.neuralNetwork.conf.outputs)
      .enter()
        .append("text")
        .classed("label", true)
        .text((d: any) => {return d;})
        .attr("y", (d: any, i: number) => {return i * this.neuronOffsetY + this.displayTopPadding + + this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.outputs.length) - (this.neuronWidth / 2) - 10})
        .attr("x", (this.parent.neuralNetwork.nn.layers.length + 1) * this.layerWidth - (this.layerWidth / 3))
          
  }
  
  private AddConnections(){
    
    for(let i = 1; i < this.parent.neuralNetwork.nn.layers.length - 1; i++){
        
      let leftAddedOffsetY = (this.caluculateMaxVerticalNeurons() - this.parent.neuralNetwork.nn.layers[i - 1].neurons.length) * 0.5 * this.neuronOffsetY;
      
      for(let j = 0; j < this.parent.neuralNetwork.nn.layers[i].neurons.length; j++){
        
        let rightAddedOffsetY = (this.caluculateMaxVerticalNeurons() - this.parent.neuralNetwork.nn.layers[i].neurons.length) * 0.5 * this.neuronOffsetY;
        
        for(let k = 0; k < this.parent.neuralNetwork.nn.layers[i].neurons[j].weights.length; k++)
          this.connections
            .append("path")
            .classed("connection", true)
            .attr("d", () => {
              
              let xStart = i * this.layerWidth + this.layerWidth / 2
              let yStart = this.displayTopPadding + leftAddedOffsetY + this.neuronOffsetY * k
              let xEnd = (i + 1) * this.layerWidth + this.layerWidth / 2
              let yEnd = this.displayTopPadding + rightAddedOffsetY + this.neuronOffsetY * j
              
              return " M" + xStart + " " + yStart + " " + xEnd + " " + yEnd;
              
            })
            .style('fill', 'none')
            .style('stroke', () => { if (this.parent.neuralNetwork.nn.layers[i].neurons[j].weights[k] >= 0) { return "#113A69"; } else { return "#A10000"; }})
            .attr('cursor', "pointer")
            .attr("stroke-linecap", "round") 
            
            .on("click", (event : any) => {
              this.ShowWeightChangeInput(event, i, j, k);
            })   
            
            .transition()
              .duration(500)
              .attr("stroke-width", () => { return this.Clamp(this.parent.neuralNetwork.nn.layers[i].neurons[j].weights[k]); })
            
      }
    }  
      
  }
  
  private AddInputConnections(){
    let inputAddedOffsetY = this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.inputs.length)
    let firstLayerAddedOffsetY = this.calculateCurrentYOffset(this.parent.neuralNetwork.nn.layers[0].neurons.length)
    
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[0].neurons.length; i++)
      for(let j = 0; j < this.parent.neuralNetwork.nn.layers[0].neurons[i].weights.length; j++)
        this.inputConnections
          .append("path")
          .classed("connection", true)
          .attr("d", () => {
            
            let xStart = this.layerWidth / 2
            let yStart = this.displayTopPadding + inputAddedOffsetY + this.neuronOffsetY * j
            let xEnd = this.layerWidth + this.layerWidth / 2
            let yEnd = this.displayTopPadding + firstLayerAddedOffsetY + this.neuronOffsetY * i
            
            return " M" + xStart + " " + yStart + " " + xEnd + " " + yEnd;
            
          })
          .style('fill', 'none')
          .style('stroke', () => { if (this.parent.neuralNetwork.nn.layers[0].neurons[i].weights[j] >= 0) { return "#113A69"; } else { return "#A10000"; }})
          .attr('cursor', "pointer")
          .attr("stroke-linecap", "round") 
          
          .on("click", (event : any) => {
            this.ShowWeightChangeInput(event, 0, i, j);
          })  
          
          .transition()
            .duration(500)
            .attr("stroke-width", () => { return this.Clamp(this.parent.neuralNetwork.nn.layers[0].neurons[i].weights[j]); })
          
  }
  
  private AddOutputConnections(){
    let layerCount = this.parent.neuralNetwork.nn.layers.length;
    
    let outputAddedOffsetY = this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.outputs.length)
    let lastLayerAddedOffsetY = this.calculateCurrentYOffset(this.parent.neuralNetwork.nn.layers[layerCount - 2].neurons.length)
    
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers[layerCount - 1].neurons.length; i++)
      for(let j = 0; j < this.parent.neuralNetwork.nn.layers[layerCount - 1].neurons[i].weights.length; j++)
        this.outputConnections
          .append("path")
          .classed("connection", true)
          .attr("d", () => {
            
            let xStart = this.layerWidth * (layerCount - 1) + this.layerWidth / 2
            let yStart = this.displayTopPadding + lastLayerAddedOffsetY + this.neuronOffsetY * j
            let xEnd = this.layerWidth * layerCount + this.layerWidth / 2
            let yEnd = this.displayTopPadding + outputAddedOffsetY + this.neuronOffsetY * i
            
            return " M" + xStart + " " + yStart + " " + xEnd + " " + yEnd;
            
          })
          .style('fill', 'none')
          .style('stroke', () => { if (this.parent.neuralNetwork.nn.layers[layerCount - 1].neurons[i].weights[j] >= 0) { return "#113A69"; } else { return "#A10000"; }})
          .attr('cursor', "pointer")
          .attr("stroke-linecap", "round") 
          
          .on("click", (event : any) => {
            this.ShowWeightChangeInput(event, layerCount - 1, i, j);
          })  
          
          .transition()
            .duration(500)
            .attr("stroke-width", () => { return this.Clamp(this.parent.neuralNetwork.nn.layers[layerCount - 1].neurons[i].weights[j]); })
  }
  
  
  
  
  private AddNeuronButtons(){
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers.length - 1; i++)
    this.addNeuronButtons
      .append("circle")
      .classed("addNeuronButton", true)
      .attr("cy", this.displayTopPadding + this.parent.neuralNetwork.nn.layers[i].neurons.length * this.neuronOffsetY + this.calculateCurrentYOffset(this.parent.neuralNetwork.nn.layers[i].neurons.length) )
      .attr("cx", (i + 1) * this.layerWidth + this.layerWidth / 2 )
      .attr("cursor", "pointer")
      
      .on("mouseenter", (event : any, d : any) => {
        select(event.currentTarget)
            .transition()
            .duration(250)
            .attr("stroke-dashoffset", 30)
            .attr("r", (this.neuronWidth / 2) + 2)
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("stroke-dashoffset", 0)
              .attr("r", (this.neuronWidth / 2))
      })
      .on("click", (event : any, d : any) => {
        this.AddNeuronToLayer(i);
      })  
      .transition()
        .duration(500)
        .attr("r", (this.neuronWidth / 2))
  }
  
  private AddLayerButtons(){
    
    for(let i = 0; i < this.parent.neuralNetwork.nn.layers.length; i++)
    this.addLayerButtons
      .append("image")
      .classed("addNeuronButton", true)
      .attr("y", 10 )
      .attr("x", (i + 1) * this.layerWidth - 25)
      .attr("width", 50)
      .attr("height", 50)
      .attr("href", "/assets/Images/Icons/insertLayer_icon.svg")
      .attr("cursor", "pointer")
      
      .on("mouseenter", (event : any, d : any) => {
        select(event.currentTarget)
            .transition()
            .duration(250)
            .attr("y", 12)
            .attr("x", (i + 1) * this.layerWidth - 27)
            .attr("width", 54)
            .attr("height", 54)
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("y", 10 )
              .attr("x", (i + 1) * this.layerWidth - 25)
              .attr("width", 50)
              .attr("height", 50)
      })
      .on("click", (event : any, d : any) => {
        this.AddLayerAtIndex(i);
      })
    
  }
  
  
  
  private AddActivationCombos(){
    for(let i = 0; i < this.parent.neuralNetwork.conf.actPerLayer.length; i++)
      this.actPerLayerCombos
        .append("select")
        .classed("activationCombo", true)
        .style("top", 60 + "px")
        .style("left", () => { return ((i + 1) * this.layerWidth + this.layerWidth / 2 - 45) + "px"})
        .on("change", (event: any, d: any) => { this.ChangeActivationForLayer(event.target.value, i) }) 
      
    
    for(let i = 0; i < this.possibleActivations.length; i++)
      this.actPerLayerCombos.selectAll("select")
        .append("option")
        .text(this.possibleActivations[i])
        .attr("value", this.possibleActivations[i])
        .attr('selected', (d: any, j: number) => { if(this.parent.neuralNetwork.conf.actPerLayer[j] == this.possibleActivations[i]) { return ""; } else { return null; } })
      
  }
  
 private AddOutputActivationCombo(){
   this.outputActivationComboDiv
    .append("select")
    .classed("activationCombo", true)
    .style("top", 60 + "px")
    .style("left", () => { return ( (this.parent.neuralNetwork.conf.actPerLayer.length + 1) * this.layerWidth + this.layerWidth / 2 - 45) + "px"})
    .on("change", (event: any, d: any) => { this.ChangeOutputActivation(event.target.value) }) 
    
    for(let i = 0; i < this.possibleActivations.length; i++)
      this.outputActivationComboDiv.select("select")
        .append("option")
        .text(this.possibleActivations[i])
        .attr("value", this.possibleActivations[i])
        .attr('selected', () => { if(this.parent.neuralNetwork.conf.actOut == this.possibleActivations[i]) { return ""; } else { return null; } })
 }
  
 
 private AddEditInputOutputButtons(){
   this.editInputOutputButtons
    .append("button")
    .classed("editInputOutputButton", true)
    .text("Input / Output")
    .style("top", () => { return this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.inputs.length) + this.displayTopPadding + (this.parent.neuralNetwork.conf.inputs.length * this.neuronOffsetY) + "px" })
    .style("left", () => { return (  this.layerWidth / 2 - 50) + "px"})
    .on("click", () => { this.ShowChangeInputOutputWindow() });
    
    this.editInputOutputButtons
    .append("button")
    .classed("editInputOutputButton", true)
    .text("Input / Output")
    .style("top", () => { return this.calculateCurrentYOffset(this.parent.neuralNetwork.conf.outputs.length) + this.displayTopPadding + (this.parent.neuralNetwork.conf.outputs.length * this.neuronOffsetY) + "px" })
    .style("left", () => { return ( (this.parent.neuralNetwork.nn.layers.length * this.layerWidth) + this.layerWidth / 2 - 50) + "px"})
    .on("click", () => { this.ShowChangeInputOutputWindow() });
 }
  
  
 
 
 
 
 
 
 
 
 
  
  
  /* POCETAK STAROG KODA =============================================================================================================
  
  // INPUT OUPUT PODACI
  public network : any;
  public inputs : string[];
  public outputs : string[];
  
  public addNeuronData : any[];
  
  
  private layerWidth = 450
  private neuronWidth = 70
  private neuronYOffset = 150
  private maxNodes : number;
  
  // Osnove za prikaz
  display : any;
  container : any;
  
  // Grupe
  inputNeurons : any;
  inputTitles : any;
  
  outputLayerTitle : any;
  outputNeurons : any;
  outputTitles : any;
  
  layers : any;
  layerTitles : any;
  
  neurons : any;
  connections : any;
  
  addNeuronButtons : any;
  addNeuronTexts : any;
  
  
  // Zoom i Pan
  minZoom = 0.1;
  currentZoom = 1;
  maxZoom = 3;
  
  private handleZoom(e : any) { 
    select('svg g')
      .attr('transform', e.transform); 
  }

  private zoom : any = 
    zoom()
    .scaleExtent([this.minZoom, this.maxZoom])
    .on('zoom', this.handleZoom);
            
    
  constructor() { }

  ngOnInit(): void {
    // TEST
    this.loadDummyData();
    
  }
  
  // TEST PODACI
  private loadDummyData(){
    this.network = {"layers":[{"neurons":[{"weights":[],"bias":2.9},{"weights":[],"bias":3.4},{"weights":[],"bias":3.4}]},{"neurons":[{"weights":[1,1,1],"bias":1.2},{"weights":[1,1,1],"bias":3.5}]},{"neurons":[]}] }
    this.inputs = [];
    this.outputs = [];
    this.SetupD3Svg();
  }
  
  
  public SetInput(event: any){
    this.inputs = event.inputs;
    
    if(event.added){
      // Update sledece
      for(var i = 0; i < this.network.layers[0].neurons.length; i++){
        this.network.layers[0].neurons[i].weights.push(1);
      }
    }
    else{
      // Update sledece
      for(var i = 0; i < this.network.layers[0].neurons.length; i++){
        this.network.layers[0].neurons[i].weights.pop();
      }
    }
    
    this.updateD3Svg();
  }
  
  public SetOutput(event: any){
    this.outputs = event.outputs;
    
    var previousLayerCount = this.network.layers[this.network.layers.length - 2].neurons.length;
    
    if(event.added){
      var weights = [];
      for(var i = 0; i < previousLayerCount; i++)
      weights.push(1);
      
      var newNeuron = { weights: weights, bias: 1 }
      
      this.network.layers[this.network.layers.length - 1].neurons.push(newNeuron);
    }
    else
      this.network.layers[this.network.layers.length - 1].neurons.pop();
    
    
    //console.log("NEW NEURON")
    //console.log(this.network.layers[this.network.layers.length - 1])
    
    this.updateD3Svg();
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  private addNeuron(layerIndex: any){
    var weights = [];
    var bias: number = 1;
    
    // Prvi sloj - proveravamo input
    if(layerIndex == 0)
      for(var i = 0; i < this.inputs.length; i++)
        weights.push(1);
      
    // Drugi sloj - proveravamo prethodni sloj
    else
      for(var i = 0; i < this.network.layers[layerIndex - 1].neurons.length; i++)
        weights.push(1);
    
        
    this.network.layers[layerIndex].neurons.push({weights: weights, bias: bias});
    
    // Update sledece
    for(var i = 0; i < this.network.layers[layerIndex + 1].neurons.length; i++)
      this.network.layers[layerIndex + 1].neurons[i].weights.push(1);
    
    

    this.updateD3Svg();
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  private updateD3Svg(){
    this.caluculateMaxNodes();
    
    this.caluculateAddNeuronData();
    
    this.container.selectAll("*").remove();
    
    this.SetupD3Svg();
  }
  
  
  
  
  
  
  
  
  
  
  
  
  private caluculateAddNeuronData(){
    this.addNeuronData = [];
    for(let i = 0; i < this.network.layers.length - 1; i++){
      let neuronIndex = this.network.layers[i].neurons.length;
      let add = {
        layer: i, 
        index: neuronIndex 
      };
      this.addNeuronData[i] = add;
    }
  }
  
  private initZoom() { 
    select('svg')
      .call(this.zoom); 
  }
  
  public ZoomIn(){
    this.zoom.scaleBy(this.display.transition().duration(500), 1.5);
  }
  public ZoomOut(){
    this.zoom.scaleBy(this.display.transition().duration(500), 0.66);
  }
  
  // Max neurona u jednom sloju (potrebno da bi mogli da centriramo sve neurone horizontalno)
  private caluculateMaxNodes(){
    this.maxNodes = 0;
    for(var i = 0; i < this.network.layers.length; i++)
        if(this.network.layers[i].neurons.length >= this.maxNodes)
            this.maxNodes = this.network.layers[i].neurons.length;
    
    if(this.inputs.length > this.maxNodes)
      this.maxNodes = this.inputs.length;
    
      if(this.outputs.length > this.maxNodes)
      this.maxNodes = this.outputs.length;
  }
  
  
  
  
  
  
  
  
  // Podesavanje SVG prikaza
  public SetupD3Svg(){
    this.caluculateMaxNodes();
    
    this.caluculateAddNeuronData();
    
    // DISPLAY
    this.display = select("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", 0)
      .attr("y", 0)
      .attr("cursor", "grab")
    
    // CONTAINER
    this.container = this.display.select("svg g")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", 0)
      .attr("y", 0)
      
    
    this.inputNeurons = this.container.selectAll("circle")
    this.inputTitles = this.container.selectAll("text")
    
    
    this.outputNeurons = this.container.selectAll("circle")
    this.outputTitles = this.container.selectAll("text")
    
    this.outputLayerTitle = this.container.select("text")
    this.layers = this.container.selectAll("rect")
    this.layerTitles = this.container.selectAll("text")
    
    this.neurons = this.container.selectAll("circle")
    this.connections = this.container.selectAll("lines")
    
    this.addNeuronButtons = this.container.selectAll("circle");
    this.addNeuronTexts = this.container.selectAll("text");
    
    // Redosled pozivanja je bitan
    // Komponente prve funkcije se prikazuju na dnu
    // Komponente poslednje funkcije se prikazuju na vrhu
    this.setupInputLayer();
    this.setupNeuralNetworkLayers();
    
    this.setupConnections();
    this.setupInputNeurons();
    this.setupHiddenNeurons();
    this.setupOutputNeuronTitles();
    
    this.setupAddNeuronButtonsAndTitles();
    
    
    this.initZoom();
  }
  
  
  
  
  // Obrada Input podataka
  private setupInputLayer(){

    
    // INPUT LAYER TITLE
    this.container
      .append("text")
      .text("Inputs")
      .attr("font-size", 28)
      .style("font-family", "Raleway")
      .attr("text-anchor", "middle")
      .attr("fill", "#555555")
      .attr("x", this.layerWidth / 2)
      .attr("y", 70)
      .attr("cursor", "pointer")
      .on("mouseenter", (event : any, d : any) => {
        select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 30)
              .attr("fill", "#000000")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 28)
              .attr("fill", "#555555")
      })
      

    // INPUT NAMES
    this.inputTitles
      .data(this.inputs)
      .enter()
      .append("text")
      .text((d : any) => d)
      .attr("font-size", 16)
      .style("font-family", "Raleway")
      .attr("text-anchor", "middle")
      .attr("fill", "#555555")
      .attr("x", this.layerWidth / 2)
      .attr("y", (d : any, i : number) => (i + 1) * this.neuronYOffset - 15 + (((this.maxNodes - this.inputs.length) * 0.5) * this.neuronYOffset))
      .attr("cursor", "pointer")
      .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 18)
              .attr("fill", "#000000")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 16)
              .attr("fill", "#555555")
      })
      
    this.inputTitles
      .exit()
      .remove()

  }
  
  // Prikaz input-a
  private setupInputNeurons(){
    // INPUT NEURONS
    this.inputNeurons
      .data(this.inputs)
      .enter()
      .append("circle")
      .attr("cx", this.layerWidth / 2)
      .attr("cy",  (d : any, i : number) => { return (i + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (((this.maxNodes - this.inputs.length) * 0.5) * this.neuronYOffset) })
      .attr("fill", "#FFFFFF")
      .attr("stroke", "#888888")
      .attr("r", (this.neuronWidth / 2))
      .attr("cursor", "pointer")
      
      .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("r", (this.neuronWidth / 2) + 3)
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("r", (this.neuronWidth / 2))
              .attr("fill", "#FFFFFF")
      })
      .on("mousedown", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("fill", "#EEEEEE")
      })
      .on("mouseup", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("fill", "#FFFFFF")
      })
    
      
    
  }
  
  // Prikaz slojeva mreze
  private setupNeuralNetworkLayers(){

    // HIDEN LAYER TITLES
    this.layerTitles
      .data(this.network.layers)
      .enter()
      .append("text")
      .text((d : any, i : number) => {
        if(this.network.layers.length - 1 == i) 
          return "Outputs"
        else
          return "Layer " + (i + 1);
      })
      .attr("font-size", 28)
      .style("font-family", "Raleway")
      .attr("text-anchor", "middle")
      .attr("fill", "#555555")
      .attr("x", (d : any, i : number) => (i + 0.5 + 1) * this.layerWidth)
      .attr("y", 70)
      .attr("cursor", "pointer")
      .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 30)
              .attr("fill", "#000000")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 28)
              .attr("fill", "#555555")
      })
    
  }
  
  // Prikaz neurona skrivenih slojeva i output-a
  private setupHiddenNeurons(){
    for(var i = 0; i < this.network.layers.length; i++){
    
      var currentYOffsetRatio = (this.maxNodes - this.network.layers[i].neurons.length) * 0.5
      
      this.neurons
        .data(this.network.layers[i].neurons)
        .enter()
        .append("circle")
        .attr("cx", (i + 0.5 + 1) * this.layerWidth)
        .attr("cy", (d : any, j : number) => (j + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (currentYOffsetRatio * this.neuronYOffset))
        .attr("fill", "#FFFFFF")
        .attr("stroke", "#888888")
        .attr("r", (this.neuronWidth / 2))
        .attr("cursor", "pointer")

        .attr("width", this.neuronWidth)
        .attr("height", this.neuronWidth)
        .on("mouseenter", (event : any, d : any) => {
            select(event.currentTarget)
                .transition()
                .duration(150)
                .attr("r", (this.neuronWidth / 2) + 3)
        })
        .on("mouseout", (event : any, d : any) => {
            select(event.currentTarget)
                .transition()
                .duration(150)
                .attr("r", (this.neuronWidth / 2))
                .attr("fill", "#FFFFFF")
                
        })
        
    }
    
    this.neurons
      .exit()
      .remove();
  }
  
  // Prikaz naziva output neurona
  private setupOutputNeuronTitles(){
    var currentYOffsetRatio = (this.maxNodes - this.network.layers[this.network.layers.length - 1].neurons.length) * 0.5
    
    this.inputTitles
      .data(this.outputs)
      .enter()
      .append("text")
      .text((d : any) => d)
      .attr("font-size", 16)
      .style("font-family", "Raleway")
      .attr("text-anchor", "middle")
      .attr("fill", "#555555")
      .attr("x", ((this.network.layers.length - 1) + 0.5 + 1) * this.layerWidth)
      .attr("y", (d : any, j : number) => (j + 1) * this.neuronYOffset + (currentYOffsetRatio * this.neuronYOffset) - 15)
      .attr("cursor", "pointer")
      .on("mouseenter", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 18)
              .attr("fill", "#000000")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 16)
              .attr("fill", "#555555")
      })
  }
  
  // Prikaz veza izmedju input-a, skrivenih slojeva i output-a
  private setupConnections(){
    var leftYOffset = (this.maxNodes - this.inputs.length) * 0.5;

    for(var i = 0; i < this.network.layers.length; i++){
        
        var rightYOffset = (this.maxNodes - this.network.layers[i].neurons.length) * 0.5;
        
        for(var j = 0; j < this.network.layers[i].neurons.length; j++){
          
            console.log("TEST: ")
            console.log(this.network.layers[i].neurons[j].weights)
            
            var lineInputOffset = 4
            var lineInputTopOffset = (this.network.layers[i].neurons[j].weights.length * lineInputOffset) / 2;
            
            
            this.connections
              .data(this.network.layers[i].neurons[j].weights)
              .enter()
              .append('path')
              .attr("stroke-width", 2)
              .attr("d", (d : any, k : number) => {
                  let xStart = (i - 0.5 + 1) * this.layerWidth + (this.neuronWidth / 2)
                  let yStart = (k + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (leftYOffset * this.neuronYOffset)
                  let xEnd = (i + 0.5 + 1) * this.layerWidth - (this.neuronWidth / 2)
                  let yEnd = (j + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (k * lineInputOffset) - lineInputTopOffset + (rightYOffset * this.neuronYOffset)
                  
                  return " M" + xStart + " " + yStart + " " + xEnd + " " + yEnd;
              })
              .style('fill', 'none')
              .style('stroke', '#BBBBBB')
              .attr('cursor', "pointer")
              .attr("stroke-linecap", "round")
              .on("mouseenter", (event : any, d : any) =>{
                  select(event.currentTarget)
                  .transition()
                  .duration(500)
                  .style('stroke', '#666666')
              })
              .on("mouseout", (event : any, d : any) =>{
                  select(event.currentTarget)
                  .transition()
                  .duration(500)
                  .style('stroke', '#BBBBBB')
              })
        }
        
        leftYOffset = rightYOffset
    }
    
    this.connections
      .exit()
      .remove();
  }
  
  
  
  private setupAddNeuronButtonsAndTitles(){
    var index = local();
    
    this.addNeuronButtons
      .data( this.addNeuronData)
      .enter()
      .append("circle")
      .attr("cx", (d : any, j : number) => {
        return (j + 0.5 + 1) * this.layerWidth
      })
      .attr("cy", (d : any, j : number) => {
        var currentYOffsetRatio = (this.maxNodes - this.network.layers[j].neurons.length) * 0.5;
        return (this.network.layers[j].neurons.length + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (currentYOffsetRatio * this.neuronYOffset)
      })
      .each((d : any, i : number, n: any) => {
        index.set(n[i], i);
      })
      .attr("fill", "#FFFFFF55")
      .attr("stroke", "#88888855")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "5,5,5")
      .attr("r", (this.neuronWidth / 2))
      .attr("cursor", "pointer")

      .attr("width", this.neuronWidth)
      .attr("height", this.neuronWidth)
      
      .on("mouseenter", (event : any, d : any) => {
        select(event.currentTarget)
            .transition()
            .duration(150)
            .attr("r", (this.neuronWidth / 2) + 10)
            .attr("stroke-dasharray", "10,10,10")
            .attr("stroke-width", "5")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(150)
              .attr("r", (this.neuronWidth / 2))
              .attr("stroke-dasharray", "5,5,5")
              .attr("fill", "#FFFFFF")
      })
      
      .on("click", (event : any, d : any) => {
        this.addNeuron(index.get(event.currentTarget));
      })
      
    this.addNeuronTexts
      .data(this.addNeuronData)
      .enter()
      .append("text")
      .text("Add new neuron")
      .attr("font-size", 18)
      .style("font-family", "Raleway")
      .attr("text-anchor", "middle")
      
      .attr("x", (d : any, j : number) => {
        return (j + 0.5 + 1) * this.layerWidth
      })
      .attr("y", (d : any, j : number) => {
        var currentYOffsetRatio = (this.maxNodes - this.network.layers[j].neurons.length) * 0.5;
        return (this.network.layers[j].neurons.length + 1) * this.neuronYOffset + (currentYOffsetRatio * this.neuronYOffset) + (this.neuronWidth) + 40
      })
      
      .attr("fill", "#00000055")
      .attr("r", (this.neuronWidth / 2))
      .attr("cursor", "pointer")

      .attr("width", this.neuronWidth)
      .attr("height", this.neuronWidth)
      
      .on("mouseenter", (event : any, d : any) => {
        select(event.currentTarget)
            .transition()
            .duration(250)
            .attr("font-size", 20)
            .attr("fill", "#000000AA")
      })
      .on("mouseout", (event : any, d : any) => {
          select(event.currentTarget)
              .transition()
              .duration(250)
              .attr("font-size", 18)
              .attr("fill", "#00000055")
      })
      
      
      this.addNeuronButtons
        .attr("cx", (d : any, j : number) => {
          
          return (j + 0.5 + 1) * this.layerWidth
        })
        .attr("cy", (d : any, j : number) => {
          var currentYOffsetRatio = (this.maxNodes - this.network.layers[d.layer].neurons.length) * 0.5;
        return (d.index) * this.neuronYOffset + (currentYOffsetRatio * this.neuronYOffset) + (this.neuronWidth) + 40
        })
        
      this.addNeuronTexts
        .attr("x", (d : any, j : number) => {
          return (j + 0.5 + 1) * this.layerWidth
        })
        .attr("y", (d : any, j : number) => {
          var currentYOffsetRatio = (this.maxNodes - this.network.layers[d.layer].neurons.length) * 0.5;
          return (d.index) * this.neuronYOffset + (currentYOffsetRatio * this.neuronYOffset) + (this.neuronWidth) + 40
        })
      
        
        this.addNeuronTexts
          .exit()
          .remove()
      
        this.addNeuronButtons
        .exit()
        .remove()
      
      
      
  }
  
  ======================================================================================================================== KRAJ STAROG KODA */ 
  
}