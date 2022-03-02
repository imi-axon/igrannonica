import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { KorisnikDetalji } from '../shared/korisnik-detalji.model';
import { KorisnikDetaljiService } from '../shared/korisnik-detalji.service';

@Component({
  selector: 'app-korisnik-detalji',
  templateUrl: './korisnik-detalji.component.html',
  styles: [
  ]
})
export class KorisnikDetaljiComponent implements OnInit {

  constructor(public service: KorisnikDetaljiService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshlist();
  }
  populateForm(selectedRecord:KorisnikDetalji){
    this.service.formData = Object.assign( {},  selectedRecord);
  }
  onDelete(id:number){
    if(confirm('Da li ste sigurni da zelite da obrisete kartu?'))
    {
      this.service.deleteKorisnikDetalji(id).subscribe(res=>{
        this.service.refreshlist();
        this.toastr.error("Brisanje uspesno", "Korisnik obrisan")
      }, err=>{console.log(err)})
    }
  }
}
