import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import {
  Inject,
  Injectable
} from '@angular/core';
import {
  Project, TaskList
} from '../domain';
import { map, mergeMap, count, switchMap, mapTo, reduce } from 'rxjs/operators';
import { Observable, from, concat } from 'rxjs';

@Injectable()
export class ProjectService {
  private readonly domain = 'taskList';
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
  add(tasklist: Project): Observable<Project> {
    tasklist.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(tasklist), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // put
  update(tasklist: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}/${tasklist.id}`;
    const toUpdate = {
      name: tasklist.name,
      desc: tasklist.desc,
      coverImg: tasklist.coverImg
    };
    return this.http.patch(url, JSON.stringify(toUpdate), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // delete
  del(tasklist: Project): Observable<Project> {
    const uri = `${this.config.uri}/taskLists/${tasklist.id}`;
    return this.http.delete(uri).pipe(
      mapTo(tasklist)
    );
  }

  // GET
  get(projectId: string): Observable<TaskList[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {projectId}}).pipe(
        map((res: any) => res as TaskList[])
    );
  }

  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;
    const drag$ = this.http.patch(dragUri, JSON.stringify({order: target.order}), this.headers)
    .pipe(
      map(res => res)
    );
    const drop$ = this.http.patch(dropUri, JSON.stringify({order: src.order}), this.headers)
    .pipe(
      map(res => res)
    );
    return concat(drag$,drop$).pipe(
      reduce((arrs, list) => [...arrs, list], [])
    );
  }

}
