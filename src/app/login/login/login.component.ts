import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
  } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import { Quote } from 'src/app/domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote: Quote = {
    cn: '满足感在于不断的努力，而不是现有的成就。全新努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full effort is full',
    pic: 'assets/img/quote_fallback.jpg'
  };

  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService
  ) {
    this.quoteService$.getQuote().subscribe(q => this.quote = q);
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['wan@163.com', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    })
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    console.log(value);
    console.log(valid);
    // 动态加载自定义验证器
    // this.form.controls['email'].setValidators(this.validate);
  }

  validate(c: FormControl): {[key: string]: any} {
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
