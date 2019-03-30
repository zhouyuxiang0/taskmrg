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
import { Project } from '../domain';

@Injectable()
export class ProjectService {
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
    project.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(project), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // put
  update(project: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.patch(url, JSON.stringify(toUpdate), this.headers).pipe(
        map((res: any) => res.json())
    );
  }

  // delete
  del(project: Project): Observable<Project> {
    const delTasks$ = from(project.taskLists).pipe(
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
    return this.http.get(url, {params: {'members_like': userId}}).pipe(
        map((res: any) => res as Project[])
    );
  }

}
