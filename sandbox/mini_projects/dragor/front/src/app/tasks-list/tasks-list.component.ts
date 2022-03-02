import { Component, Input, OnInit, Output } from '@angular/core';
import { TasksList, defval } from '../tasks-list';
import { Task } from '../task';
import { TasksListService } from '../tasks-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
})
export class TasksListComponent implements OnInit {

  @Input() public state: TasksList = defval;

  constructor() { }

  ngOnInit(): void {    
  }

}
