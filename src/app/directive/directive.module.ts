import { DragDirective } from './drag-drop/drag.directive';
import { DragDropService } from './drag-drop.service';
import { DropDirective } from './drag-drop/drop.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DragDirective, 
    DropDirective
  ],
  exports: [
    DragDirective,
    DropDirective
  ],
  providers: [
    DragDropService
  ]
})
export class DirectiveModule { }
