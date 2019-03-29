import {
  HttpClient, HttpHeaders
} from '@angular/common/http';
import {
  Inject,
  Injectable
} from '@angular/core';
import {
  Project
} from '../domain';
import { map, mergeMap, count, switchMap, mapTo } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

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
    const delTasks$ = from(tasklist.taskLists).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    return delTasks$.pipe(
      switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${tasklist.id}`)),
      mapTo(tasklist)
    );
  }

  // GET
  get(userId: string): Observable<Project[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {'members_like': userId}}).pipe(
        map((res: any) => res as Project[])
    );
  }

}
