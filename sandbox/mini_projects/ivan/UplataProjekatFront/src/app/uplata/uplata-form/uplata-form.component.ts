import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Uplata } from 'src/app/shared/uplata.model';
import { UplataService } from 'src/app/shared/uplata.service';

@Component({
  selector: 'app-uplata-form',
  templateUrl: './uplata-form.component.html',
  styles: [
  ]
})
export class UplataFormComponent implements OnInit {

  constructor(public service:UplataService, private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  
  onUplataSubmit(form:NgForm){
    this.service.postUplata().subscribe(
      res => {
        this.resetUplataForm(form);
        this.service.refreshList();
        this.toastr.success('Uplata uspesno izvrsena!','Info uplate')
      },
      err =>{ 
        console.log(err); 
        this.toastr.error('Greska pri izvrsenju uplate!','Info uplate')
      }
    );
  }
  
  resetUplataForm(form:NgForm){
    form.form.reset();
    this.service.formData = new Uplata();
  }

}
