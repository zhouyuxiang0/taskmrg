import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Task, TaskList } from '../domain';
import {
    count,
    map,
    mapTo,
    mergeMap,
    reduce,
    switchMap
} from 'rxjs/operators';

@Injectable()
export class TaskService {
  private readonly domain = 'tasks';
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) {}

  // post
  add(task: Task): Observable < Task > {
    task.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(task), this.headers).pipe(
      map((res: any) => res.json())
    );
  }

  // put
  update(task: Task): Observable < Task > {
    const url = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      desc: task.desc,
      priority: task.priority,
      dueDate: task.dueDate,
      reminder: task.reminder,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      remark: task.remark
    };
    return this.http.patch(url, JSON.stringify(toUpdate), this.headers).pipe(
      map((res: any) => res.json())
    );
  }

  // delete
  del(task: Task): Observable < Task > {
    const uri = `${this.config.uri}/taskLists/${task.id}`;
    return this.http.delete(uri).pipe(
      mapTo(task)
    );
  }

  // GET
  get(taskListId: string): Observable < Task[] > {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {
      params: {
        taskListId
      }
    }).pipe(
      map((res: any) => res as Task[])
    );
  }

  getByLists(lists: TaskList[]): Observable<Task[]> {
    return from(lists).pipe(
      mergeMap(list => this.get(list.id)),
      reduce((tasks, t: Task[]) => [...tasks, ...t], [])
    );
  }

  complete(task: Task): Observable < Task > {
    const url = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.patch(url, JSON.stringify({completed: !task.completed}), this.headers).pipe(
      map((res: any) => res.json())
    );
  }

  move(taskId: string, taskListId: string): Observable < Task[] > {
    const url = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http.patch(url, JSON.stringify({taskListId}), this.headers).pipe(
      map((res: any) => res)
    );
  }

  moveAll(srcListId: string, targetListId: string): Observable <Task[] > {
    return this.get(srcListId).pipe(
      mergeMap(tasks => from(tasks)),
      mergeMap(task => this.move(task.id, targetListId)),
      reduce((arr, x) =>  [...arr, x], [])
    );
  }

}
