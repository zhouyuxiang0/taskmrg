import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProjectService } from './project.service';
import { QuoteService } from './quote.service';
import { TaskListService } from './task-list.services';
import { TaskService } from './task.service';
import { UserService } from './user.service';

@NgModule()
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        QuoteService,
        ProjectService,
        TaskListService,
        TaskService,
        UserService
      ]
    };
  }
}
