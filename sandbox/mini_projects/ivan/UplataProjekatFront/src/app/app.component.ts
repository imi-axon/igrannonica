import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UplataService } from './shared/uplata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(public service: UplataService, private toastr:ToastrService) { }
  
  title = 'UplataProjekatFront';
  
  onUplataDelete(id:number){
    this.service.deleteUplata(id)
    .subscribe(
      res => { 
        this.service.refreshList(); 
        this.toastr.success('Uplata uspesno izbrisana!','Info uplate')
      },
      err => { 
        console.log(err) 
        this.toastr.success('Greska pri brisanju uplate!','Info uplate')
      }
    );
  }
}
