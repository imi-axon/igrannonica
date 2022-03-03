import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dugme',
  templateUrl: './dugme.component.html',
  styleUrls: ['./dugme.component.css']
})
export class DugmeComponent implements OnInit {

  @Input() tekst:string="";
  @Input() boja:string="";
  @Output() klik =new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    this.klik.emit();
  }
}
