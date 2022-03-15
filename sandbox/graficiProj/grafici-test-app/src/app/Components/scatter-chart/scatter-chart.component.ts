import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.scss']
})
export class ScatterChartComponent implements OnInit {

  constructor() { }

  podaci: ChartData<'scatter'> =
    {
      datasets: [
        {
          label: "x-y",
          data: [
          { x: 16.4, y: 325 },
          { x: 11.9, y: 185 },
          { x: 15.2, y: 400 },
          { x: 18.5, y: 406 },
          { x: 22.1, y: 522 },
          { x: 19.4, y: 312 },
          { x: 25.1, y: 614 },
          { x: 23.4, y: 744 },
          { x: 18.1, y: 521 }
          ],
         // showLine: true, //da tackice budu povezane
          fill: false,
         // borderColor: 'rgba(0, 200, 0, 1)',
         pointRadius:5

        }
      ],
    };

  scatterChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Scatter chart',
      },
    },
  };

  ngOnInit(): void {
  }

}
