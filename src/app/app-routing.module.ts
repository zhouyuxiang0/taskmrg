import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }, {
        path: '',
        loadChildren: './login/login.module#LoginModule'
      }, {
        path:'',
        loadChildren: './project/project.module#ProjectModule'
      }
    ]
  }//{
    // path: '',
    // loadChildren: './project/project.module#ProjectModule'
  //}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
