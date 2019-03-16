import { InviteComponent } from './invite/invite.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { NgModule } from '@angular/core';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    NewProjectComponent,
    InviteComponent
  ],
  entryComponents: [
    NewProjectComponent,
    InviteComponent
  ],
  imports: [
    SharedModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
