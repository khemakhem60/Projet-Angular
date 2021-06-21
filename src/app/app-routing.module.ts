import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/services/auth.guard';
import { DashbordComponent } from './dashbord-component/dashbord.component';
import { LayoutComponent } from './layout-component/layout.component';
import { LoginComponent } from './login-component/login.component';
import { ArticleListComponent } from './article-list-component/article-list.component';
import { EventListComponent } from './event-list-component/event-list.component';
import { MemberListComponent } from './member-list-component/member-list.component';
import { ToolListComponent } from './tool-list-component/tool-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'members'
  },
  {
    path: 'members',
    canActivate: [AuthGuard],
    component: MemberListComponent
  },
  {
    path: 'articles',
    canActivate: [AuthGuard],
    component: ArticleListComponent
  },
  {
    path: 'tools',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: ToolListComponent
  },
  {
    path: 'events',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: EventListComponent
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: DashbordComponent
  },
  {
    path: 'member/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: MemberListComponent
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'logout',
    pathMatch: 'full',
    component: LayoutComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

