import * as _ from 'lodash';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { InviteComponent } from '../invite/invite.component';
import { NewProjectComponent } from '../new-project/new-project.component';
import { Project } from '../../domain/project.model';
import { ProjectService } from 'src/app/services/project.service';
import { Subscription } from 'rxjs';
import { listAnimation } from 'src/app/anims/list.anim';
import { slideToRight } from 'src/app/anims/router.anim';

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
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  projects;
  sub: Subscription
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    // 这里是异步的操作 在某一时间 project 为空
    this.sub = this.service$.get('1').subscribe(projects => {
      this.projects = projects;
      this.cd.markForCheck(); // 赃值检测
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // 新增项目dialog
  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(
      NewProjectComponent, {
        data: {
          thumbnails: this.getThumbnails(),
          img: selectedImg
        }
      }
    );
    dialogRef.afterClosed().pipe(
      take(1), // 因为在函数内subscribe 需要取消订阅  这里使用take取一次后自动complete 不需要销毁
      filter(n => n),
      map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)})),
      switchMap(v => this.service$.add(v))
    ).subscribe(project => {
      this.projects = [...this.projects, project];
      this.cd.markForCheck();
    });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  // 编辑项目dialog
  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(
      NewProjectComponent, {
        data: {
          thumbnails: this.getThumbnails(),
          project
        }
      }
    );
    dialogRef.afterClosed().pipe(
      take(1), // 因为在函数内subscribe 需要取消订阅  这里使用take取一次后自动complete 不需要销毁
      filter(n => n),
      map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)})),
      switchMap(v => this.service$.update(v))
    ).subscribe(prj => {
      const index = this.projects.map(p => p.id).indexOf(prj.id);
      this.projects = [...this.projects.slice(0, index), prj, ...this.projects.slice(index + 1)];
      this.cd.markForCheck();
    });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除项目',
        content: '您确认删除该项目吗?'
      }
    });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      switchMap(_ => this.service$.del(project))
    ).subscribe(prj => {
      this.projects = this.projects.filter(p => p.id !== prj.id);
      this.cd.markForCheck();
    });
  }

  private getThumbnails() {
    return _.range(0, 39)
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img ;
  }
}
