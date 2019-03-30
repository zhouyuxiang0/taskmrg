import {
    count,
    map,
    mapTo,
    mergeMap,
    switchMap
    } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Task } from '../domain';

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
      reminder: task.remark,
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
    const delTasks$ = from(task.taskLists).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    return delTasks$.pipe(
      switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${task.id}`)),
      mapTo(task)
    );
  }

  // GET
  get(userId: string): Observable < Task[] > {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {
      params: {
        'members_like': userId
      }
    }).pipe(
      map((res: any) => res as Task[])
    );
  }

}
