import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewUserComponent } from './view-user.component';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewUserComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-user/add-user.module').then(m => m.AddUserModule),
        canActivate: [AuthGuard],
        data: {
          role: [1, 2]
        }
      },
      {
        path: 'detail',
        data: {
          title: 'Detail',
        },
        children: [
          {
            path: ':id',
            loadChildren: () => import('../view-by-id-user/view-by-id-user.module').then(m => m.ViewByIdUserModule),
            canActivate: [AuthGuard],
            data: {
              role: [1, 2]
            }
          },
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [ViewUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ForEveryoneModule,
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class ViewUserModule { }
