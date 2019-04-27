import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  count,
  map,
  mapTo,
  mergeMap,
  switchMap
} from 'rxjs/operators';

import { Project } from '../domain';

@Injectable()
export class ProjectService {
  // restful api 资源对象
  private readonly domain = 'projects';
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
  add(project: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(project), this.headers).pipe(
        map((res: any) => res)
    );
  }

  // put
  update(project: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}/${project.id}`;
    // 使用put 会将所有project更新 使用patch 可以更新部分属性
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.patch(url, JSON.stringify(toUpdate), this.headers).pipe(
        map((res: any) => res)
    );
  }

  // delete
  del(project: Project): Observable<Project> {
    const delTasks$ = from(project.taskLists ? project.taskLists : []).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    return delTasks$.pipe(
      switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`)),
      mapTo(project)
    );
  }

  // GET
  get(userId: string): Observable<Project[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {members_like: userId}}).pipe(
        map((res: any) => res as Project[])
    );
  }

}
