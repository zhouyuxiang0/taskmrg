import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss']
})
export class ImageListSelectComponent implements ControlValueAccessor {

  @Input() title = "选择";
  @Input() cols = 6;
  @Input() rowHeight = '64px';
  @Input() items: string[] = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = "80px";

  selected: string;

  constructor() { }

  onChange(i) {
    this.selected = this.items[i];
  }

  writeValue(): void {

  }

  registerOnChange(): void {

  }

  registerOnTouched(): void {

  }

}
