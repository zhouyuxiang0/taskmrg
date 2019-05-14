import * as actions from '../../actions/quote.action';
import * as fromRoot from '../../reducers';

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Observable } from 'rxjs';
import { Quote } from 'src/app/domain/quote.model';
import { QuoteService } from 'src/app/services/quote.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable < Quote > ;

  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService,
    private store$: Store < fromRoot.State >
  ) {
    this.quote$ = this.store$.select(state => state.quote.quote);
    this.quoteService$.getQuote().subscribe(q => this.store$.dispatch({
      type: actions.QUOTE_SUCCESS,
      payload: q
    }));
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['wan@163.com', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    })
  }

  onSubmit({
    value,
    valid
  }, ev: Event) {
    ev.preventDefault();
    console.log(value);
    console.log(valid);
    // 动态加载自定义验证器
    // this.form.controls['email'].setValidators(this.validate);
  }

  validate(c: FormControl): {
    [key: string]: any
  } {
    if (!c.value) {
      return null;
    }
    const pattern = /^zhou+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNotValid: 'The email must start with zhou'
    }
  }

}
