import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  constructor(private appComp:AppComponent) { }

  ngOnInit(): void {
  }
  
  switchTheme() {
    this.appComp.switchTheme();
      }

}
