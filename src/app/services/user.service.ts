import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Project, User } from '../domain';
import {
  filter,
  map,
  reduce,
  switchMap
} from 'rxjs/operators';

@Injectable()
export class UserService {
  // restful api 资源对象
  private readonly domain = 'users';
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) {}

  /**
   * 搜索用户
   * @param filter 要搜索的字符
   */
  searchUsers(filter: string): Observable<User[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {email_like: filter}}).pipe(
        map((res: any) => res as User[])
    );
  }

  /**
   * 获取项目参与用户
   * @param projectId 项目id
   */
  getUsersByProject(projectId: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get(uri, {params: {projectId}}).pipe(
      map(res => res as User[])
    );
  }

  /**
   * 向用户添加项目
   * @param user 用户
   * @param projectId 项目id
   */
  addProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    if (projectIds.indexOf(projectId) > -1) {
      return of(user);
    }
    return this.http.patch(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), this.headers).pipe(
      map(res => res as User)
    );
  }

  /**
   * 向用户删除项目
   * @param user 用户
   * @param projectId 项目id
   */
  removeProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    const index = projectIds.indexOf(projectId);
    if (index === -1) {
      return of(user);
    }
    const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
    return this.http.patch(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), this.headers).pipe(
      map(res => res as User)
    );
  }

  /**
   * 批量向项目添加成员用户
   * @param project 项目
   */
  batchUpdateProjectRef(project: Project): Observable<User[]> {
    const projectId = project.id;
    const memberIds = project.members ? project.members : [];
    return from(memberIds).pipe(
      switchMap(id => {
        const uri = `${this.config.uri}/${this.domain}/${id}`;
        return this.http.get(uri).pipe(
          map(res => res as User)
        );
      }),
      filter(user => user.projectIds.indexOf(projectId) === -1),
      switchMap(u => this.addProjectRef(u, projectId)),
      reduce((arr: User[], curr: User) => [...arr, curr], [])
    );
  }

}
