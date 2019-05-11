import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  of
} from 'rxjs';
import { getAreaByCity, getCitiesByProvince, getProvinces } from 'src/app/utils/area.util';
import { map, startWith } from 'rxjs/operators';

import { Address } from '../../domain/user.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AreaListComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => AreaListComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  // 选中的值
  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  // 下拉选项
  provinces$: Observable < string[] > ;
  cities$: Observable < string[] > ;
  districts$: Observable < string[] > ;
  sub: Subscription;
  private propagateChange = (_: any) => {};
  constructor() {}

  ngOnInit() {
    const province$ = this._province.asObservable().pipe(startWith('')) as Observable < string > ;
    const city$ = this._city.asObservable().pipe(startWith('')) as Observable < string > ;
    const district$ = this._district.asObservable().pipe(startWith('')) as Observable < string > ;
    const street$ = this._street.asObservable().pipe(startWith('')) as Observable < string > ;
    const val$ = combineLatest(province$, city$, district$, street$).pipe(
      map(
        ([_p, _c, _d, _s]) => {
          console.log(123);
          return {
            province: _p,
            city: _c,
            district: _d,
            street: _s
          };
        }
      )
    );
    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    });
    this.provinces$ = of (getProvinces());
    this.cities$ = province$.pipe(
      map((p: string): string[] => {
        console.log(p);
        return getCitiesByProvince(p);
      })
    );
    this.districts$ = combineLatest(province$, city$).pipe(
      map(([p, c]) => getAreaByCity(p, c))
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Address) {
    console.log(obj);
    if (obj) {
      this._address = obj;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}

  validate(c: FormControl): {
    [key: string]: any
  } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }

}
