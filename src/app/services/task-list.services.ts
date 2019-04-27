import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Inject,
  Injectable
} from '@angular/core';
import { Observable, concat, from } from 'rxjs';
import { count, map, mapTo, mergeMap, reduce, switchMap } from 'rxjs/operators';

import {
  TaskList
} from '../domain';

@Injectable()
export class TaskListService {
  private readonly domain = 'taskLists';
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
  add(taskList: TaskList): Observable<TaskList> {
    taskList.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(taskList), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // put
  update(taskList: TaskList): Observable<TaskList> {
    const url = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    };
    return this.http.patch(url, JSON.stringify(toUpdate), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // delete
  del(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/taskLists/${taskList.id}`;
    return this.http.delete(uri).pipe(
      mapTo(taskList)
    );
  }

  // GET
  get(projectId: string): Observable<TaskList[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {projectId}}).pipe(
        map((res: any) => res as TaskList[])
    );
  }

  // 拖拽列表
  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;
    const drag$ = this.http.patch(dragUri, JSON.stringify({order: target.order}), this.headers)
    .pipe(
      map(res => res)
    );
    const drop$ = this.http.patch(dropUri, JSON.stringify({order: src.order}), this.headers)
    .pipe(
      map(res => {console.log(res); return res; })
    );
    console.log(drop$);
    return concat(drag$, drop$).pipe(
      reduce((arrs, list) => [...arrs, list], [])
    );
  }

}
