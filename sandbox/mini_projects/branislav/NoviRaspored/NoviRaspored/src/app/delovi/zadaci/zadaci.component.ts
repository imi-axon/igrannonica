import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { ServisService } from 'src/app/servis.service';
import { Zadatak } from 'src/app/ZadModel';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-zadaci',
  templateUrl: './zadaci.component.html',
  styleUrls: ['./zadaci.component.css']
})
export class ZadaciComponent implements OnInit {
  zadaci:Zadatak[]=[];
  zadatak:Zadatak;
  @Output() obrisiZad:EventEmitter<Zadatak>=new EventEmitter();
  constructor(private zadServis:ServisService) { }

  ngOnInit(): void {
      this.zadServis.uzmiZadatke().subscribe((zad) => this.zadaci=zad);
  }
  brisi(zadatak:Zadatak){
    this.zadServis.obrisiZadatak(zadatak).subscribe(() => (this.zadaci = this.zadaci.filter((t) => t.zadId !== zadatak.zadId)));
  }
  dodaj(noviZ:Zadatak){
    this.zadServis.dodajZadatak(noviZ).subscribe((noviZ) => this.zadaci.push(noviZ));
  }
  xd8(zadatak){
    this.zadServis.nam8(zadatak).subscribe();
  }
}
