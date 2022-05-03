import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popup-window',
  templateUrl: './popup-window.component.html',
  styleUrls: ['./popup-window.component.scss']
})
export class PopupWindowComponent implements OnInit {

  poruka:String="";

  constructor(private translate:TranslateService, @Inject(MAT_DIALOG_DATA) public data:any) {
    this.poruka=data.poruka;
   }

  ngOnInit(): void {
  }
}
