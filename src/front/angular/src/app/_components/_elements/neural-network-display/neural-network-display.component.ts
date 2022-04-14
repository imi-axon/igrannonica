import { Component, OnInit } from '@angular/core';
import { local, select, svg, zoom } from 'd3'

@Component({
  selector: 'app-neural-network-display',
  templateUrl: './neural-network-display.component.html',
  styleUrls: ['./neural-network-display.component.scss']
})
export class NeuralNetworkDisplayComponent implements OnInit {
  
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

    
}
