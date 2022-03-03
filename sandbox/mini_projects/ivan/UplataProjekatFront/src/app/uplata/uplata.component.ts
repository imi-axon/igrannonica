import { Component, OnInit } from '@angular/core';
import { UplataService } from '../shared/uplata.service';

@Component({
  selector: 'app-uplata',
  templateUrl: './uplata.component.html',
  styles: [
  ]
})
export class UplataComponent implements OnInit {

  constructor(public service: UplataService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }

}
