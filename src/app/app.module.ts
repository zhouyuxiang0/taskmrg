import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgModule } from '@angular/core';
import { ProjectModule } from './project/project.module';
import { SharedModule } from './shared/shared.module';
import { TaskModule } from './task/task.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule,
    MatSidenavModule,
    CoreModule,
    BrowserAnimationsModule,
    ProjectModule,
    LoginModule,
    TaskModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
