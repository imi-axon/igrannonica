import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-selector',
  templateUrl: './landing-page-selector.component.html',
  styleUrls: ['./landing-page-selector.component.scss']
})
export class LandingPageSelectorComponent implements OnInit {
  
  @Output()
  OptionSelected: EventEmitter<number> = new EventEmitter<number>();
  
  public maxOptions: number = 4;
  public selectedOption: number = 0;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  
  public Select(selected: number){
    this.OptionSelected.emit(selected);
  }
  
  public NextSelection(){
    this.selectedOption < this.maxOptions - 1 ? this.Select(this.selectedOption + 1) : {};
  }

}
