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
   public newTask: string = '';

  public addingTask: boolean = false;

  constructor(private taskListService: TasksListService) { }

  ngOnInit(): void {    
  }

  onAddTaskClick() {
    if (!this.addingTask)
      this.addingTask = true;
    else
      this.addTask()
  }

  addTask() {
    console.log('add task ' + this.newTask);
    this.taskListService.addTaskToList(this.newTask, this.state.id).subscribe(
      () => {
        this.addingTask = false;
        this.taskListService.getTasksList(this.state.id).subscribe(
          (response) => {
            if (response.body != null)
              this.state = response.body;
          }
        );
      }
    );
  }

}
