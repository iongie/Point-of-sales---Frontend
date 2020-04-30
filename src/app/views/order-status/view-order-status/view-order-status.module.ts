import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewOrderStatusComponent } from './view-order-status.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Order Status'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewOrderStatusComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-order-status/add-order-status.module').then(m => m.AddOrderStatusModule),
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
            loadChildren: () => import('../view-by-id-order-status/view-by-id-order-status.module').then(m => m.ViewByIdOrderStatusModule),
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
  declarations: [ViewOrderStatusComponent],
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
export class ViewOrderStatusModule { }
