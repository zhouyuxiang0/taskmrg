import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  startWith,
  tap
  } from 'rxjs/operators';
import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  Input
  } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators
  } from '@angular/forms';
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  isBefore,
  isFuture,
  isValid,
  parse,
  subDays,
  subMonths,
  subYears
  } from 'date-fns';
import { isDate } from '@angular/common/src/i18n/format_date';
import { isValidDate } from 'src/app/utils/date.util';
import { Observable, Subscription } from 'rxjs';

export enum AgeUnit {
  Year = 0,
    Month,
    Day
}

export interface Age {
  age: number;
  unit: AgeUnit;
}

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
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthsTop = 24;
  @Input() monthsBottom = 1;
  @Input() yearsTop = 150;
  @Input() yearsBottom = 1;
  @Input() format = 'YYY-MM-DD';
  @Input() debounceTime = 3000;
  selectedUnit = AgeUnit.Year;
  ageUnits = [{
      value: AgeUnit.Year,
      label: '岁'
    },
    {
      value: AgeUnit.Month,
      label: '月'
    },
    {
      value: AgeUnit.Day,
      label: '天'
    },
  ];

  dateOfBirth;
  form: FormGroup;
  sub: Subscription;

  constructor(
    private fb: FormBuilder
  ) {}
  private propagateChange = (_: any) => {};

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    // this.form.get('ageUnit').setValue(AgeUnit.Year);
    this.form = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, {
        validator: this.validateAge('ageNum', 'ageUnit')
      })
    });
    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');
    const birthday$ = birthday.valueChanges.pipe(
      map(d => ({
        date: d,
        from: 'birthday'
      })),
      filter(_ => birthday.valid)
    );
    const ageNum$ = ageUnit.valueChanges.pipe(
      startWith(ageNum.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );
    const ageUnit$ = ageUnit.valueChanges.pipe(
      tap(d => console.log(d)),
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );
    const age$ = new Observable().pipe(
      // tslint:disable-next-line: variable-name deprecation
      combineLatest(ageNum$, ageUnit$, (_n: number, _u) => this.toDate({ age: _n, unit: _u })),
      map(d => ({ date: d, from: 'age' })),
      filter(_ => this.form.get('age').valid)
    );
    const merged$ = new Observable().pipe(
// tslint:disable-next-line: deprecation
      merge(birthday$, age$),
      filter(_ => this.form.valid)
    );
    this.sub = merged$.subscribe((d: {
      date: any;
      from: string;
  } | {
      date: string;
      from: string;
  }) => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
          ageNum.patchValue(age.age, {
            emitEvent: false
          });
        }
        if (age.unit !== ageUnit.value) {
          this.form.get('ageUnit').setValue(age.unit);
          // this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, {
            emitEvent: false
          });
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, {
            emitEvent: false
          });
          this.propagateChange(d.date);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  validate(c: FormControl): {
    [key: string]: any
  } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (isValidDate(val)) {
      return null;
    }
    return {
      dateOfBirthInvalid: true
    };
  }

  validateDate(c: FormControl): {
    [key: string]: any
  } {
    const val = c.value;
    return isValidDate(val) ? null : {
      birthdayInvalid: true
    };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): {
      [ket: string]: any
    } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year:
          result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearsTop;
          break;
        case AgeUnit.Month:
          result = ageNumVal >= this.monthsBottom && ageNumVal < this.monthsTop;
          break;
        case AgeUnit.Day:
          result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop;
          break;
        default:
          break;
      }
      return result ? null : {
        ageInvalid: true
      };
    };
  }

  writeValue(obj: any): void {
    if (obj) {
      this.form.get('birthday').patchValue(format(obj, this.format));
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {

  }

  toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();
    return isBefore(subDays(now, this.daysTop), date) ? {
        age: differenceInDays(now, date),
        unit: AgeUnit.Day
      } :
      isBefore(subMonths(now, this.monthsTop), date) ? {
        age: differenceInMonths(now, date),
        unit: AgeUnit.Month
      } : {
        age: differenceInYears(now, date),
        unit: AgeUnit.Year
      };
  }

  toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year:
        return format(subYears(now, age.age), this.format);
      case AgeUnit.Month:
        return format(subMonths(now, age.age), this.format);
      case AgeUnit.Day:
        return format(subDays(now, age.age), this.format);
      default:
        return null;
    }
  }

}
