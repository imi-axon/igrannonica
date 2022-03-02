import { Component, OnInit, Output } from '@angular/core';
import { defval, TasksList } from '../tasks-list';
import { TasksListService } from '../tasks-list.service';

@Component({
  selector: 'app-tasks-lists-list',
  templateUrl: './tasks-lists-list.component.html',
})
export class TasksListsListComponent implements OnInit {

  @Output() public state: TasksList[] = [];

  constructor(private tasksListService: TasksListService) { }

  ngOnInit(): void {
    this.readTasksList();
  }

  readTasksList() {
    this.tasksListService.getTasksLists().subscribe(
      (response) => {
        console.log(response.body);
        if (response.body != null)
          this.state = response.body;
      }
    );
  }

}
