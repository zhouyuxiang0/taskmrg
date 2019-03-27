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
import { map } from 'rxjs/operators';

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

  add(project: Project) {
    project.id = null;
    const url = `${this.config.url}/${this.domain}`;
    return this.http.post(url, JSON.stringify(project), this.headers).pipe(
        map((res: any) => res.json())
    );
  }
}
