import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Quote } from '../domain/quote.model';

@Injectable()
export class QuoteService {

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config
  ) {}

  getQuote(): Observable < Quote > {
    const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
    return this.http.get(uri).debug('quote:').pipe(map(res => res as Quote));
  }
}
