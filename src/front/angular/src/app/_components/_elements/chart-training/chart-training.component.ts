import { BLACK_ON_WHITE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { gray, interval } from 'd3';

@Component({
  selector: 'app-chart-training',
  templateUrl: './chart-training.component.html',
  styleUrls: ['./chart-training.component.scss']
})
export class ChartTrainingComponent implements OnInit {

  constructor() { }
  private brojTest: number;
  private brojTrain: number;
  private test: number[] = [];
  private train: number[] = [];
  private labele: string[] = [];
  private labela: string = '';
  private br: number = 0;
  public chart: any;

  ngOnInit(): void {

    this.chart = new Chart('lineChart', {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Treniranje'
          }
        },
        elements: {
          point:{
              radius: 0
          }
      }
      },
      data: {
        labels: [],
        datasets: [
          {
            label: 'Training loss',
            data: [],
            // data: [1],
            tension: 0.5,
            borderWidth:2,
            borderColor:"#000000",
            backgroundColor:"	#000000"
           
          },
          {
            label: 'Validation loss',
            data: [],
            //data: [1],
            tension: 0.5,
            borderWidth:2,
            borderColor:"#dd6060",
            backgroundColor:"#dd6060"
        
          },
        ]

      }
    })

  //  this.dataUpdate();


  }

  //TESTNA F-JA
  public dataUpdate(epoch: number, tLoss: number, vLoss: number) {
 
    this.chart.data.labels.push('epoch ' + epoch);
    this.chart.data.datasets[0].data.push(vLoss);
    this.chart.data.datasets[1].data.push(tLoss);
    this.chart.update();

  }
  

}
