import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';

import { Identity } from '../../domain/user.model';
import { IdentityType } from 'src/app/domain';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  identityTypes = [
    {
      value: IdentityType.IdCard, label: '身份证'
    }, {
      value: IdentityType.Insurance, label: '医保'
    }, {
      value: IdentityType.Passport, label: '护照'
    }, {
      value: IdentityType.Military, label: '军官证'
    }, {
      value: IdentityType.Other, label: '其他'
    },
  ];
  identity: Identity = {identityType: null, identityNo: null};
  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit() {
    const val$ = combineLatest(this.iddNo, this.idType, (_no, _type) => {
      return {
        identityType: _type,
        identityNo: _no
      }
    })
  }

  ngOnDestroy() {
    
  }

  onIdTypeChange(idType: IdentityType) {
    this._idType.next(idType)
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo)
  }

  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get iddNo(): Observable<string> {
    return this._idNo.asObservable();
  }

  writeValue(obj: any) {}

  registerOnChange(fn: any) {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any) {}

  validate(c: FormControl): {[key: string]: any} {
    const val = c.value;
    if (!val) {
      return null;
    }
  }

}
