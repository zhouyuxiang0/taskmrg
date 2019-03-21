import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface DragData {
  tag: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  constructor() { }

  private _dragData = new BehaviorSubject<DragData>(null);

  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  clearDragData() {
    this._dragData.next(null);
  }
}
