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
            text: 'TITLE'
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
            label: 'Test loss',
            data: [],
            // data: [1],
            tension: 0.5,
            borderWidth:2,
            borderColor:"#000000",
            backgroundColor:"	#000000"
           
          },
          {
            label: 'Training loss',
            data: [],
            //data: [1],
            tension: 0.5,
            borderWidth:2,
            borderColor:"#606060",
            backgroundColor:"#606060"
        
          },
        ]

      }
    })

   this.dataUpdate();


  }

  //TESTNA F-JA
  dataUpdate() {
    // if(this.chart) 
    //   this.chart.destroy();



    console.log("uso");
    this.brojTest = Math.random();
    this.brojTrain =Math.random(); // * (max-min)+min da bude izmedju max i min
    this.br++;
    this.labela = 'epoha' + this.br;
    // this.test.push(this.brojTest);
    // this.train.push(this.brojTrain);
    // this.labele.push(this.labela);


    console.log(this.brojTest);
    console.log(this.brojTrain);

    // this.chart.data.datasets[0].data = this.test;
    // this.chart.data.datasets[1].data = this.train;
    // this.chart.data.labels = this.labele;

    this.chart.data.labels.push(this.labela);
    this.chart.data.datasets[0].data.push(this.brojTest);
    this.chart.data.datasets[1].data.push(this.brojTrain);
    this.chart.update();

    if(this.br<100)
    {
      this.delay(200).then(() => this.dataUpdate());
    }


  
    // chart.data.datasets[0].data.push(this.brojTest);
    // chart.update();

    // chart.data.datasets[0].data.push(this.brojTrain);
    // chart.update();

    // if (chart.data.labels)
    //   chart.data.labels.push('labela' + this.br);

    // chart.update();


  }

   delay(time:number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  

}
