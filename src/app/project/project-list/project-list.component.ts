import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { InviteComponent } from '../invite/invite.component';
import { NewProjectComponent } from '../new-project/new-project.component';
import { listAnimation } from 'src/app/anims/list.anim';
import { slideToRight } from 'src/app/anims/router.anim';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight,
    listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  projects;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.service$.get('1').subscribe(projects => this.projects = projects);
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '新增项目' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = [...this.projects, { id: 3, name: "you一个新项目", desc: "you一个新项目", coverImg: "assets/img/covers/8.jpg" }, { id: 4, name: "一个新项目", desc: "这是一个新项目", coverImg: "assets/img/covers/9.jpg" }];
      this.cd.markForCheck();
    });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  launchUpdateDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '编辑项目:' } });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '您确认删除该项目吗?' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(this.projects);
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.cd.markForCheck();
    });
  }

}
