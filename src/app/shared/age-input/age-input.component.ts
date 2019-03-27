import { combineLatest, merge } from 'rxjs';
import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
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
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter
  } from '@angular/material/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap
  } from 'rxjs/operators';
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
  }, {
    provide: MAT_DATE_LOCALE, useValue: 'zh-Hans'
  }, {
    provide: DateAdapter, useClass: NativeDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS
  }]
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthsTop = 24;
  @Input() monthsBottom = 1;
  @Input() yearsTop = 150;
  @Input() yearsBottom = 1;
  @Input() format = 'YYYY/MM/DD';
  @Input() debounceTime = 300;
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
    const initDate = this.dateOfBirth ? this.dateOfBirth : format((subYears(Date.now(), 30)), 'YYYY-MM-DD');
    const initAge = this.toAge(initDate);
    this.form = this.fb.group({
      birthday: [initDate, this.validateDate],
      age: this.fb.group({
        ageNum: [initAge.age],
        ageUnit: [initAge.unit]
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

    const ageNum$ = ageNum.valueChanges.pipe(
      startWith(ageNum.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );

    const ageUnit$ = ageUnit.valueChanges.pipe(
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );

    const age$ = combineLatest(ageNum$, ageUnit$).pipe(
      map(([num, unit]) => ([this.toDate({ age: num, unit })])),
      map(d => ({ date: d, from: 'age' })),
      filter(_ => this.form.get('age').valid)
    );

    const merged$ = merge(birthday$, age$).pipe(
      filter(_ => this.form.valid)
    );

    this.sub = merged$.subscribe((d: {date: any; from: string; }) => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age === ageNum.value && age.unit === ageUnit.value) {
          return;
        }
        ageUnit.patchValue(age.unit, {emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: true});
        ageNum.patchValue(age.age, {emitEvent: false});
        this.selectedUnit = age.unit;
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(this.form.get('birthday').value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          this.form.get('birthday').patchValue(d.date[0], { emitEvent: false });
          console.log(this.form.get('birthday'));
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
      const date = format(obj, this.format);
      this.form.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.form.get('age').get('ageNum').patchValue(age.age);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
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
    if (isBefore(subDays(now, this.daysTop), date)) {
      return {
        age: differenceInDays(now, date),
        unit: AgeUnit.Day
      };
    } else if (isBefore(subMonths(now, this.monthsTop), date)) {
      return {
        age: differenceInMonths(now, date),
        unit: AgeUnit.Month
      };
    } else {
      return {
        age: differenceInYears(now, date),
        unit: AgeUnit.Year
      };
    }
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
