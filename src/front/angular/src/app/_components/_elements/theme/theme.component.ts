import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) { }

  private theme: any;

  ngOnInit() {
    this.theme = localStorage.getItem("theme");
    this.initializeTheme();
  }

  initializeTheme = (): void => this.renderer.addClass(this.document.body, this.theme);

  switchTheme() {
    this.theme = localStorage.getItem("theme");
    console.log("menjam " + this.theme);
    this.document.body.classList.replace(this.theme, this.theme === 'light_theme' ? (this.theme = 'dark_theme') : (this.theme = 'light_theme'))
    console.log("promenjeno " + this.theme);
    localStorage.setItem("theme",this.theme);
  }


}


