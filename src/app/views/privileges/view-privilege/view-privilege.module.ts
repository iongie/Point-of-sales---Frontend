import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewPrivilegeComponent } from './view-privilege.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Privilege'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewPrivilegeComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-privilege/add-privilege.module').then(m => m.AddPrivilegeModule),
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
            loadChildren: () => import('../view-by-id-privilege/view-by-id-privilege.module').then(m => m.ViewByIdPrivilegeModule),
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
  declarations: [ViewPrivilegeComponent],
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
export class ViewPrivilegeModule { }
