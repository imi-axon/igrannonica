import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Zadatak } from 'src/app/ZadModel';
import { ServisService } from 'src/app/servis.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  @Input() zad:Zadatak;
  
  zadaci:Zadatak[]=[];
  zadatak:Zadatak;

  @Output() obrisiZad:EventEmitter<Zadatak>=new EventEmitter();
  @Output() namesti8:EventEmitter<Zadatak>=new EventEmitter();
  constructor(private zadServis:ServisService) { }

  ngOnInit(): void {
      //this.zadServis.uzmiZadatke().subscribe((zad) => this.zadaci=zad);
  }

  obrisi(zadatak){
    this.obrisiZad.emit(zadatak);
  }

  set8(zadatak){
    this.namesti8.emit(zadatak);
  }
}
