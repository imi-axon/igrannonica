import { Component, Input, OnInit, Output } from '@angular/core';
import { TasksList, defval } from '../tasks-list';
import { Task } from '../task';
import { TasksListService } from '../tasks-list.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
})
export class TasksListComponent implements OnInit {

  @Output() public state: TasksList = defval;

  constructor(private tls: TasksListService) { }

  ngOnInit(): void {
    this.tls.getTasksList().subscribe(
      (response) => {
        console.log(response.body);
        if (response.body != null)
          this.state = response.body;
      }
    );
  }

}
