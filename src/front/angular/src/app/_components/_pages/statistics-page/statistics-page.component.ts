import { Component, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit{
  
  // Ovoj promenljivoj ne trebalo menjati vrednost
  @Output() onBind: boolean = false;
  
  public correlationView: boolean = false;
  
  eventsSubject: Subject<void> = new Subject<void>();
  
  constructor() { }
  

  ngOnInit(): void {
    
  }
  
  switchTableView(){
    this.correlationView = !this.correlationView;
  }
  
}
