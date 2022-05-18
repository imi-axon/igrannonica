import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/_utilities/_services/auth.service';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  poruka:String="";

  constructor(private translate:TranslateService, @Inject(MAT_DIALOG_DATA) public data:any, private dialog:MatDialogRef<PopupWindowComponent>,
  public auth: AuthService) {
    dialog.disableClose=true;
    this.poruka=data.poruka;
   }

  ngOnInit(): void {
  }
  
  close() {
    this.dialog.close();
  }
}
