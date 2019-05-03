import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

import { Auth } from '../domain/auth.model';
import { Observable } from 'rxjs';
import { Project } from '../domain';
import { User } from '../domain/user.model';

@Injectable()
export class AuthService {
  // restful api 资源对象
  private readonly domain = 'users';
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private token = '123' + 'abc';
  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) {}

  // 注册
  register(user: User): Observable<Auth> {
    user.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get(uri , {
      params: {
        email : user.email
      }
    }).pipe(
      switchMap((res: string[]) => {
        if (res.length > 0) {
          throw new Error('username existed');
        }
        return this.http.post(uri, JSON.stringify(user), this.headers).pipe(
            map((r: any) => ({token: this.token, user: r}))
        );
      })
    );
  }

  // 登录
  login(username: string, password: string): Observable<Auth> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {
      params: {
        email: username,
        password
      }
    }).pipe(
        map((res: User[]) => {
          if (res.length === 0) {
            throw new Error('username or password not match');
          }
          return {
            token: this.token,
            user: res[0]
          } as Auth;
        })
    );
  }
}
