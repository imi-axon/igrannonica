import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opcije-edit-dataset',
  templateUrl: './opcije-edit-dataset.component.html',
  styleUrls: ['./opcije-edit-dataset.component.scss']
})
export class OpcijeEditDatasetComponent implements OnInit {

  constructor() { }

  prikaziEnkodiranje: boolean = false;
  ngOnInit(): void {
  }

  public vrsteEnkodiranja() {
    console.log("uso");
    if (this.prikaziEnkodiranje == false)
      this.prikaziEnkodiranje = true;
    else this.prikaziEnkodiranje = false;

    console.log(this.prikaziEnkodiranje);
  }

}
