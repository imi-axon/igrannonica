import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TasksList } from './tasks-list';

@Injectable({
  providedIn: 'root'
})
export class TasksListService {

  constructor(private http: HttpClient) { }

  getTasksList(): Observable<HttpResponse<TasksList>> {
    console.log('Service');
    return this.http.get<TasksList>(
      'https://localhost:7239/api/task/get/2',
      {
        observe: 'response'
      }
    );
  }
}
