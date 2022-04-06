import { Component, OnInit } from '@angular/core';
import { select, zoom } from 'd3'

@Component({
  selector: 'app-neural-network-display',
  templateUrl: './neural-network-display.component.html',
  styleUrls: ['./neural-network-display.component.scss']
})
export class NeuralNetworkDisplayComponent implements OnInit {
  
  public network : any;
  public inputData : any;
  
  private layerWidth = 450
  private neuronWidth = 70
  private neuronYOffset = 150
  private maxNodes : number;
  
  // Osnove za prikaz
  display : any;
  container : any;
  
  displayWidth = 0
  displayHeight = 0
  
  // Grupe
  inputNeurons : any;
  inputTitles : any;
  layers : any;
  layerTitles : any;
  neurons : any;
  connections : any;
  
  
  // Zoom i Pan
  minZoom = 0.25
  currentZoom = 1
  maxZoom = 5
  
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
    this.network = {"nn":{"layers":[{"activation":"Aktivacija 1","neurons":[{"weights":[4.3,6.15],"bias":0.76},{"weights":[2.21,3.63],"bias":2.1},{"weights":[5.76,3.7],"bias":2.9},{"weights":[6.75,7.11],"bias":3.4},{"weights":[3.55,3.64],"bias":3.4}]},{"activation":"Aktivacija 2","neurons":[{"weights":[7.18,3.64,2.31,7.25,7.8],"bias":3.11},{"weights":[1.71,3.88,5.2,4.21,5.47],"bias":1.2},{"weights":[3.61,4.8,8.8,3.12,6.77],"bias":3.5}]},{"activation":"Aktivacija 3","neurons":[{"weights":[7.18,3.45,7.95],"bias":3.11}]}]}}
    this.inputData = [{"name": "X input", "value": 2.25},{"name": "Y input", "value": 3.54}]
    this.SetupD3Svg();
    
  }
  
  private getDisplaySize(){
    this.displayWidth = (this.network.nn.layers.length + 1) * this.layerWidth + 200
    this.displayHeight = (this.maxNodes + this.neuronYOffset + 10) * 150
    
    if(this.displayWidth > this.displayHeight)
      this.displayHeight = this.displayWidth
    else
      this.displayWidth = this.displayHeight
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
    for(var i = 0; i < this.network.nn.layers.length; i++)
        if(this.network.nn.layers[i].neurons.length >= this.maxNodes)
            this.maxNodes = this.network.nn.layers[i].neurons.length;
  }
  
  
  // Podesavanje SVG prikaza
  public SetupD3Svg(){
    this.getDisplaySize()
    this.caluculateMaxNodes();
    
    // DISPLAY
    this.display = select("svg")
      .attr("width", this.displayWidth)
      .attr("height", this.displayHeight)
      .attr("x", 0)
      .attr("y", 0)
    
    // CONTAINER
    this.container = this.display.select("svg g")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("x", 0)
      .attr("y", 0)
    
    
    this.inputNeurons = this.container.selectAll("circle")
    this.inputTitles = this.container.selectAll("text")

    this.layers = this.container.selectAll("rect")
    this.layerTitles = this.container.selectAll("text")
    
    this.neurons = this.container.selectAll("circle")
    this.connections = this.container.selectAll("lines")
    
    // Redosled pozivanja je bitan
    // Komponente prve funkcije se prikazuju na dnu
    // Komponente poslednje funkcije se prikazuju na vrhu
    this.setupInputLayer()
    this.setupNeuralNetworkLayers()
    this.setupConnections();
    this.setupInputNeurons()
    this.setupHiddenAndOutputNeurons();
    
    this.initZoom();
  }
  
  // Obrada Input podataka
  private setupInputLayer(){
    // INPUT LAYER
    this.container
      .append("rect")
      .attr("width", this.layerWidth)
      .attr("height", "100%")
      .attr("fill", "#EEEEEE")
      .attr("x", 0)
      .attr("y", 0)
    
    // INPUT LAYER TITLE
    this.container
      .append("text")
      .text("Input Layer")
      .attr("font-size", 28)
      .style("font-family", "Montserrat")
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
      .data(this.inputData)
      .enter()
      .append("text")
      .text((d : any) => d.name)
      .attr("font-size", 16)
      .style("font-family", "Montserrat")
      .attr("text-anchor", "middle")
      .attr("fill", "#555555")
      .attr("x", this.layerWidth / 2)
      .attr("y", (d : any, i : number) => (i + 1) * this.neuronYOffset - 15 + (((this.maxNodes - this.inputData.length) * 0.5) * this.neuronYOffset))
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
  
  // Prikaz input-a
  private setupInputNeurons(){
    // INPUT NEURONS
    this.inputNeurons
      .data(this.inputData)
      .enter()
      .append("circle")
      .attr("cx", this.layerWidth / 2)
      .attr("cy",  (d : any, i : number) => { return (i + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (((this.maxNodes - this.inputData.length) * 0.5) * this.neuronYOffset) })
      .attr("fill", "#FFFFFF")
      .attr("stroke", "#888888")
      .attr("r", (this.neuronWidth / 2))
      .attr("cursor", "grab")
      
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
    
    // HIDDEN LAYERS + OUTPUT LAYER
    this.layers
      .data(this.network.nn.layers)
      .enter()
      .append("rect")
      .attr("width", this.layerWidth)
      .attr("height", "100%")
      .attr("fill", "#EEEEEE")
      .attr("x", (d : any, i : number) => (i + 1) * this.layerWidth)
      .attr("y", 0)


    // HIDEN LAYER TITLES
    this.layerTitles
      .data(this.network.nn.layers)
      .enter()
      .append("text")
      .text((d : any, i : number) => "Layer " + (i + 1))
      .attr("font-size", 28)
      .style("font-family", "Montserrat")
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
  private setupHiddenAndOutputNeurons(){
    for(var i = 0; i < this.network.nn.layers.length; i++){
    
      var currentYOffsetRatio = (this.maxNodes - this.network.nn.layers[i].neurons.length) * 0.5
      
      this.neurons
        .data(this.network.nn.layers[i].neurons)
        .enter()
        .append("circle")
        .attr("cx", (i + 0.5 + 1) * this.layerWidth)
        .attr("cy", (d : any, j : number) => (j + 1) * this.neuronYOffset + (this.neuronWidth / 2) + (currentYOffsetRatio * this.neuronYOffset))
        .attr("fill", "#FFFFFF")
        .attr("stroke", "#888888")
        .attr("r", (this.neuronWidth / 2))
        .attr("cursor", "grab")

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
  }
  
  // Prikaz veza izmedju input-a, skrivenih slojeva i output-a
  private setupConnections(){
    var leftYOffset = (this.maxNodes - this.inputData.length) * 0.5

    for(var i = 0; i < this.network.nn.layers.length; i++){
        
        var rightYOffset = (this.maxNodes - this.network.nn.layers[i].neurons.length) * 0.5
        
        for(var j = 0; j < this.network.nn.layers[i].neurons.length; j++){
            
            var lineInputOffset = 4
            var lineInputTopOffset = (this.network.nn.layers[i].neurons[j].weights.length * lineInputOffset) / 2;
            
            
            this.connections
              .data(this.network.nn.layers[i].neurons[j].weights)
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
  }
  

}
