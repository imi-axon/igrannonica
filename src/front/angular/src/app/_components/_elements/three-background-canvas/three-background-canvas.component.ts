import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { AmbientLight, Color, IcosahedronGeometry, Mesh, MeshPhongMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';

@Component({
  selector: 'three-background-canvas',
  templateUrl: './three-background-canvas.component.html',
  styleUrls: ['./three-background-canvas.component.scss']
})
export class ThreeBackgroundCanvasComponent implements OnInit {
  
  constructor() { }
  
  private subscription: Subscription;
  
  @ViewChild("canvas")
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement{ return this.canvasRef.nativeElement; }
  
  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight
  }
  
  private camera!: PerspectiveCamera;
  private cameraX: number = 0;
  private cameraZ: number = 6;
  private cameraY: number = -5;
  
  private fov: number = 50;
  private nearClippingPlane: number = 0.1;
  private farClippingPlane: number = 1000;
  
  // Light
  private ambientLight: AmbientLight = new AmbientLight(new Color(0x003FB9), 0.5);
  private pointLight: PointLight = new PointLight(new Color(0xFFFFFF), 1.5, Infinity);
  
  // Backgroudn Icosahedrons
  private icosahedronsCount: number = 30;
  private icosahedronsSpreadX: number = 1500;
  private icosahedronsSpreadY: number = 1500;
  private icosahedronsSpreadZ: number = -600;
  private icosahedronScale: number = 10;
  private backgroundIcosahedrons: Mesh[] = [];
  
  // Renderer
  private renderer!: WebGLRenderer;
  
  // Scene
  private scene!: Scene;
  
  private setBackgroudnIcosahedrons(){
    this.backgroundIcosahedrons = [];
    for(let i = 0; i < this.icosahedronsCount; i++){
      let x = Math.random() * this.icosahedronsSpreadX - this.icosahedronsSpreadX / 2;
      let y = Math.random() * this.icosahedronsSpreadY - this.icosahedronsSpreadY / 2;
      let z = Math.random() * this.icosahedronsSpreadZ - 400;
      let scale = Math.random() * this.icosahedronScale;
      this.backgroundIcosahedrons.push( new Mesh( new IcosahedronGeometry(1, 0), new MeshPhongMaterial({color: 0x009DF5})) );
      this.backgroundIcosahedrons[i].position.set(x, y, z);
      this.backgroundIcosahedrons[i].scale.set(scale, scale, scale);
      
      this.scene.add(this.backgroundIcosahedrons[i]);
    }
  }
  
  private createScene(){
    this.scene = new Scene();
    
    // DODAVANJE KOMPONENTI
    
    // Pozadinski icosahedroni
    this.setBackgroudnIcosahedrons();
    
    
    this.pointLight.position.set(100, 100, 100);
    this.scene.add(this.pointLight);
    
    this.scene.add(this.ambientLight);
  }
  
  private setCamera(){
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera( this.fov, aspectRatio, this.nearClippingPlane, this.farClippingPlane);
    this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
  }
  
  private startRenderingLoop(){
    this.renderer = new WebGLRenderer( 
      {
        canvas: this.canvas,
        alpha: true,
        antialias: true
      }
    );
    this.renderer.setClearColor( 0x000000, 0 );
    
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      
    let component: any = this;
    (
      function render(){
        requestAnimationFrame(render);
        
        for(let i = 0; i < component.icosahedronsCount; i++){
          component.backgroundIcosahedrons[i].rotation.x += (0.001 + (i * 0.2) / 1000);
          component.backgroundIcosahedrons[i].rotation.y += (0.001 - (i * 0.2) / 1000);
          component.backgroundIcosahedrons[i].rotation.z += (0.001 + (i * 0.2) / 1000);
        }
        
        
        component.renderer.render(component.scene, component.camera);
      }()
    )
  }
  
  ngAfterViewInit(){
    this.createScene();
    this.setCamera();
    this.startRenderingLoop();
  }
  
  // RESIZE ==================================================================================
  private onResize(e: any){
    //this.canvas.width = e.srcElement.innerWidth;
    //this.canvas.height = e.srcElement.innerHeight;
    
    this.renderer.setSize(e.srcElement.innerWidth, e.srcElement.innerHeight);
    this.camera.aspect = e.srcElement.innerWidth / e.srcElement.innerHeight
    this.camera.updateProjectionMatrix();
  }
  
  
  ngOnInit() {
    
    setTimeout(() => {
      
      this.subscription = fromEvent(window, 'resize').subscribe(
        e => {
          this.onResize(e);
        }
      );
          
    }, 0);
  }
  
  ngOnDestroy(){ 
    document.body.className=""; 
    
    this.subscription.unsubscribe();
  }
  
  
}
