import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {}

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
