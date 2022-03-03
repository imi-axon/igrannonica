import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { KorisnikDetalji } from 'src/app/shared/korisnik-detalji.model';
import { KorisnikDetaljiService } from 'src/app/shared/korisnik-detalji.service';

@Component({
  selector: 'app-korisnik-detalji-forma',
  templateUrl: './korisnik-detalji-forma.component.html',
  styles: [
  ]
})
export class KorisnikDetaljiFormaComponent implements OnInit {

  constructor(public service:KorisnikDetaljiService,
    private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    //this.service.formData.idkorisnika=parseInt()
    if(this.service.formData.iDkorisnika == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }

  insertRecord(form:NgForm)
  {
    this.service.postKorisnikDetalji().subscribe(
      res =>{
        this.resetForm(form);
        this.service.refreshlist();
        this.toastr.success('Submitted successfully', 'Korisnik registrovan')
      },
      err =>{console.log(err);}
    );
  }

  updateRecord(form: NgForm){
    if(confirm("da li ste sigurni da zelite da updajtujete?"))
    this.service.putKorisnikDetalji().subscribe(
      res =>{
        this.resetForm(form);
        this.service.refreshlist();
        this.toastr.info('Update-ovanje uspesno', 'Korisnik update-ovan')
      },
      err =>{console.log(err);}
    );
  }
  resetForm(form:NgForm){
    form.form.reset();
    this.service.formData = new KorisnikDetalji();
  }
}
