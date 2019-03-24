import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { map, combineLatest, merge } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AgeInputComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AgeInputComponent),
    multi: true
  }]
})
export class AgeInputComponent implements ControlValueAccessor {

  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.form = this.fb.group({
      birthday: [],
      age: this.fb.group({
        ageNum: [],
        ageUnit: []
      })
    });
    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');
    const birthday$ = birthday.valueChanges.pipe(
      map(d =>  ({date: d, from: 'birthday'}))
    );
    const ageNum$ = ageUnit.valueChanges;
    const ageUnit$ = ageUnit.valueChanges;
    const age$ = new Observable().pipe(
// tslint:disable-next-line: variable-name deprecation
      combineLatest(ageNum$, ageUnit$, (_n, _u) => {
        return this.toDate({age: _n, unit: _u});
      }),
      map(d => {
        return {date: d, from: 'age'};
      })
    );
    const merged$ = new Observable().pipe(
      merge(birthday$, age$)
    );
  }

  private propagateChange = (_: any) => {};

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {

  }

}
