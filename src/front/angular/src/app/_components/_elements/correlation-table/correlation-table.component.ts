import { Component, OnInit } from '@angular/core';
import { DatasetService } from 'src/app/_utilities/_services/dataset.service';
import { StatisticsService } from 'src/app/_utilities/_services/statistics.service';

@Component({
  selector: 'correlation-table',
  templateUrl: './correlation-table.component.html',
  styleUrls: ['./correlation-table.component.scss']
})
export class CorrelationTableComponent implements OnInit {
  

  constructor(public statisticsService:StatisticsService) { }

  ngOnInit(): void {
    
  }
  
}
