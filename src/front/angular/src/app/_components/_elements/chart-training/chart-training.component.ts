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
        events: [],
        animation:{
          duration:0
        },
        scales:{
          xAxes:{
            title:{
              display:true,
              text: "Epoch",
              font:{
                size:15
              },
              color:"#2C5D96"
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit:5,
              color:"#2C5D96"
            }
          },
          yAxes:{
            ticks:{
              maxTicksLimit:4,
              color:"#2C5D96"
            }
          }
        },
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
            borderWidth:2.5,
            borderColor:"#2C5D96",
            backgroundColor:"	#2C5D96"
           
          },
          {
            label: 'Validation loss',
            data: [],
            //data: [1],
            tension: 0.5,
            borderWidth:2.5,
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

    this.chart.data.labels.push(epoch);
    this.chart.data.datasets[0].data.push(vLoss);
    this.chart.data.datasets[1].data.push(tLoss);
    

  }
  public chartUpdate() {

    this.chart.update();

  }
  

}
