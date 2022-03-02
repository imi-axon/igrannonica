import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit {

  @Input() public state: Task = { id: 0, content: 'Default' };

  constructor() { }

  ngOnInit(): void {
    
  }

}
