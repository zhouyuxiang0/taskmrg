import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectListComponent } from './project-list/project-list.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [{
  path: 'projects',
  component: ProjectListComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectRoutingModule {}
