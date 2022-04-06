import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  constructor() { document.body.className = "landing_page_theme"; }
  
  private subscription: Subscription;

  @ViewChild("canvas")
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement{ return this.canvasRef.nativeElement; }
  
  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight
  }
  
  
  // Camera
  private camera!: THREE.PerspectiveCamera;
  private cameraX: number = 0;
  private cameraZ: number = 3.5;
  private cameraY: number = 0.1;
  
  private fov: number = 80;
  private nearClippingPlane: number = 0.1;
  private farClippingPlane: number = 1000;
  
  
  // Light
  private ambientLight: THREE.AmbientLight = new THREE.AmbientLight(new THREE.Color(0x003FB9), 0.5);
  private pointLight: THREE.PointLight = new THREE.PointLight(new THREE.Color(0xFFFFFF), 1.5, Infinity);

  
  // Icosahedron
  private icosahedron: THREE.Mesh = new THREE.Mesh( new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({color: 0x009DF5}) );
  
  // Backgroudn Icosahedron
  private icosahedronsCount: number = 8;
  private icosahedronsSpreadX: number = 500;
  private icosahedronsSpreadY: number = 300;
  private icosahedronsSpreadZ: number = -100;
  private icosahedronScale: number = 5;
  private backgroundIcosahedrons: THREE.Mesh[] = [];
  
  // Renderer
  private renderer!: THREE.WebGLRenderer;
  
  // Scene
  private scene!: THREE.Scene;
  
  
  
  
  
  
  /*
  private resizeCanvasToDisplaySize() {
    let canvas = this.renderer.domElement;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
  
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
  */
  
  private setBackgroudnIcosahedrons(){
    this.backgroundIcosahedrons = [];
    for(let i = 0; i < this.icosahedronsCount; i++){
      let x = Math.random() * this.icosahedronsSpreadX - this.icosahedronsSpreadX / 2;
      let y = Math.random() * this.icosahedronsSpreadY - this.icosahedronsSpreadY / 2;
      let z = Math.random() * this.icosahedronsSpreadZ - 100;
      let scale = Math.random() * this.icosahedronScale;
      this.backgroundIcosahedrons.push( new THREE.Mesh( new THREE.IcosahedronGeometry(1, 0), new THREE.MeshPhongMaterial({color: 0x009DF5})) );
      this.backgroundIcosahedrons[i].position.set(x, y, z);
      this.backgroundIcosahedrons[i].scale.set(scale, scale, scale);
      
      this.scene.add(this.backgroundIcosahedrons[i]);
    }
  }
  
  private createScene(){
    this.scene = new THREE.Scene();
    
    // DODAVANJE KOMPONENTI
    
    // Glavni icosahedron
    this.scene.add(this.icosahedron);
    
    // Pozadinski icosahedroni
    this.setBackgroudnIcosahedrons();
    
    
    this.pointLight.position.set(10, 10, 10);
    this.scene.add(this.pointLight);
    
    this.scene.add(this.ambientLight);
  }
  
  
  private setCamera(){
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera( this.fov, aspectRatio, this.nearClippingPlane, this.farClippingPlane);
    this.camera.position.set(this.cameraX, this.cameraY, this.cameraZ);
  }
  
  
  private startRenderingLoop(){
    this.renderer = new THREE.WebGLRenderer( 
      {
        canvas: this.canvas,
        alpha: true,
        antialias: true
      }
    );
    this.renderer.setClearColor( 0x000000, 0 );
    
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    
    let component: HomePageComponent = this;
    (
      function render(){
        requestAnimationFrame(render);
        
        //component.resizeCanvasToDisplaySize();
        
        component.icosahedron.rotation.x += 0.001;
        component.icosahedron.rotation.y += 0.001;
        component.icosahedron.rotation.z += 0.001;
        
        for(let i = 0; i < component.icosahedronsCount; i++){
          component.backgroundIcosahedrons[i].rotation.x += (0.002 + i / 1000);
          component.backgroundIcosahedrons[i].rotation.y += (0.002 - i / 1000);
          component.backgroundIcosahedrons[i].rotation.z += (0.002 + i / 1000);
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
  
  
  
  
  
  
  
  
  // Mouse movement
  private oldMouseX: number = 0;
  private oldMouseY: number = 0;
  
  private mouseStabilizerX: number = 0.0001;
  private mouseStabilizerY: number = 0.0005;
  
  private onMouseMove(e : MouseEvent){
    let mouseDeltaX = e.clientX - this.oldMouseX;
    let mouseDeltaY = e.clientY - this.oldMouseY;
    
    //console.log(mouseDeltaX + " " + mouseDelteY);
    
    this.icosahedron.rotation.x += mouseDeltaY * this.mouseStabilizerY;
    this.icosahedron.rotation.y += mouseDeltaX * this.mouseStabilizerX;
    this.icosahedron.rotation.z += (mouseDeltaX + mouseDeltaY) * this.mouseStabilizerX;
    
    this.oldMouseX = e.clientX;
    this.oldMouseY = e.clientY;
  }
  
  ngOnInit() {
    this.subscription = fromEvent(document, 'mousemove').subscribe(
      e => {
        this.onMouseMove(e as MouseEvent);
      });
  }
  
  ngOnDestroy(){ 
    document.body.className=""; 
    
    this.subscription.unsubscribe();
  }
}
