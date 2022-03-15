import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit {
  
  public correlationView : Boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  switchTableView(){
    this.correlationView = !this.correlationView;
  }
  
}
