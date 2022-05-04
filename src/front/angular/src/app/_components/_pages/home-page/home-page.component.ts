import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription, windowWhen } from 'rxjs';

import {AmbientLight, PointLight, Color, Mesh, IcosahedronGeometry, MeshStandardMaterial, WebGLRenderer, MeshPhongMaterial, Scene, PerspectiveCamera} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { LandingPageSelectorComponent } from '../../_elements/landing-page-selector/landing-page-selector.component';
import {MatDialog} from '@angular/material/dialog';
import { PopupWindowComponent } from '../../_elements/popup-window/popup-window.component';
import { TranslateService } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, AfterViewInit {
  constructor(
    private translate:TranslateService
  ) { document.body.className = "landing_page_theme"; }

  
  private subscription: Subscription;

  @ViewChild("canvas")
  private canvasRef: ElementRef;
  private get canvas(): HTMLCanvasElement{ return this.canvasRef.nativeElement; }
  
  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight
  }
  
  // Camera
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
  
  // Icosahedron
  private icosahedron: Mesh = new Mesh( new IcosahedronGeometry(1, 0), new MeshStandardMaterial({color: 0x009DF5}) );
  
  
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
  
  private threeOnLoad(){
    window.scrollTo({top: 0})
    
    gsap.to(this.camera.position, {
      duration: 2,
      y: 0,
      ease: "Power1.easeInOut",
      onStart: () =>{
        this.movable = false;
        document.body.style.overflowY = 'hidden';
      },
      onComplete: () =>{
        this.movable = true;
        document.body.style.overflowY = 'scroll';
      }
    });
    
  }
  
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
    
    // Glavni icosahedron
    this.scene.add(this.icosahedron);
    
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
      
    let component: HomePageComponent = this;
    (
      function render(){
        requestAnimationFrame(render);
        
        //component.resizeCanvasToDisplaySize();
        
        component.icosahedron.rotation.x += 0.001;
        component.icosahedron.rotation.y += 0.001;
        component.icosahedron.rotation.z += 0.001;
        
        for(let i = 0; i < component.icosahedronsCount; i++){
          component.backgroundIcosahedrons[i].rotation.x += (0.001 + (i * 0.2) / 1000);
          component.backgroundIcosahedrons[i].rotation.y += (0.001 - (i * 0.2) / 1000);
          component.backgroundIcosahedrons[i].rotation.z += (0.001 + (i * 0.2) / 1000);
        }
        
        
        //console.log(component.camera.position.y)
        
        
        component.renderer.render(component.scene, component.camera);
      }()
    )
  }
  
  ngAfterViewInit(){
    this.createScene();
    this.setCamera();
    this.startRenderingLoop();
  }
  
  
  
  // STRANICENJE
  @ViewChild("selector", {static: true}) selector: LandingPageSelectorComponent;
  @ViewChild("page1", {static: true}) page1: ElementRef<HTMLDivElement>;
  @ViewChild("page2", {static: true}) page2: ElementRef<HTMLDivElement>;
  @ViewChild("page3", {static: true}) page3: ElementRef<HTMLDivElement>;
  @ViewChild("page4", {static: true}) page4: ElementRef<HTMLDivElement>;
  
  public movable: boolean = false;
  private pageHeight: number = 50;
  
  public ChangePage(pageNumber: number){
    if(!this.movable)  
      return;
      
    gsap.to(this.camera.position, {
      duration: 2,
      y: -this.pageHeight * pageNumber,
      ease: "Power1.easeInOut",
      onStart: () =>{
        document.body.style.overflowY = 'hidden';
        this.movable = false;
      },
      onComplete: () =>{
        this.movable = true;
        document.body.style.overflowY = 'scroll';
        this.oldScrollY = window.scrollY;
      }
    });
    
    switch(pageNumber){
      case 0:
        window.scrollTo({ top: 0 })
        this.selector.selectedOption = 0;
        break;
        
      case 1:
        window.scrollTo({ top: document.body.clientHeight * 2})
        this.selector.selectedOption = 1;
        break;
      case 2:
        
        window.scrollTo({ top: document.body.clientHeight * 4})
        this.selector.selectedOption = 2;
        break;
        
      case 3:
        window.scrollTo({ top: document.body.clientHeight * 6})
        this.selector.selectedOption = 3;
        break;
        
      default:
        {};
    }
  }
  
  
  
  
  
  
  

  // SCROLL ==================================================================================
  private oldScrollY: number = 0;
  
  private onScroll(e: any){
    if(!this.movable)
      return;
      
    let deltaScrollY = this.oldScrollY - window.scrollY;
    
    this.camera.position.y += deltaScrollY * this.pageHeight / (window.innerHeight * 2);
    
    //console.log(this.camera.position.y)
    
    //console.log("Window: " + window.innerHeight + " | Current: " + window.scrollY)
    
    // STRANA 1
    if(window.scrollY < window.innerHeight - (window.innerHeight / 2))
      this.selector.selectedOption = 0;
      
    // STRANA 2
    if(window.scrollY > 2 * window.innerHeight - (window.innerHeight / 2) && window.scrollY < 3 * window.innerHeight - (window.innerHeight / 2))
      this.selector.selectedOption = 1;
    
    // STRANA 3
    if(window.scrollY > 4 * window.innerHeight - (window.innerHeight / 2) && window.scrollY < 5 * window.innerHeight - (window.innerHeight / 2))
      this.selector.selectedOption = 2;
    
    // STRANA 3
    if(window.scrollY > 6 * window.innerHeight - (window.innerHeight / 2) && window.scrollY < 7 * window.innerHeight - (window.innerHeight / 2))
      this.selector.selectedOption = 3;
    
    
    this.oldScrollY = window.scrollY;
  }
  
  // RESIZE ==================================================================================
  private onResize(e: any){
    //this.canvas.width = e.srcElement.innerWidth;
    //this.canvas.height = e.srcElement.innerHeight;
    
    this.renderer.setSize(e.srcElement.innerWidth, e.srcElement.innerHeight);
    this.camera.aspect = e.srcElement.innerWidth / e.srcElement.innerHeight
    this.camera.updateProjectionMatrix();
  }
  
  // MOUSE MOVEMENT ==========================================================================
  private oldMouseX: number = 0;
  private oldMouseY: number = 0;
  
  private mouseStabilizerX: number = 0.0001;
  private mouseStabilizerY: number = 0.0005;
  
  private onMouseMove(e : MouseEvent){
    let mouseDeltaX = e.clientX - this.oldMouseX;
    let mouseDeltaY = e.clientY - this.oldMouseY;
    
    this.icosahedron.rotation.x += mouseDeltaY * this.mouseStabilizerY;
    this.icosahedron.rotation.y += mouseDeltaX * this.mouseStabilizerX;
    this.icosahedron.rotation.z += (mouseDeltaX + mouseDeltaY) * this.mouseStabilizerX;
    
    this.oldMouseX = e.clientX;
    this.oldMouseY = e.clientY;
  }
  
  ngOnInit() {
    
    setTimeout(() => {
      
      this.subscription = fromEvent(document, 'scroll').subscribe(
        e => {
          this.onScroll(e);
      });
      
      this.subscription = fromEvent(document, 'mousemove').subscribe(
        e => {
          this.onMouseMove(e as MouseEvent);
      });
        
      this.subscription = fromEvent(window, 'resize').subscribe(
        e => {
          this.onResize(e);
        }
      );
          
      this.threeOnLoad();
          
    }, 0);
  }
  
  ngOnDestroy(){ 
    document.body.className=""; 
    
    this.subscription.unsubscribe();
  }
}
