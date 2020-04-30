import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewPaymentTypeComponent } from './view-payment-type.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Kitchen type'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewPaymentTypeComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-payment-type/add-payment-type.module').then(m => m.AddPaymentTypeModule),
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
            loadChildren: () => import('../view-by-id-payment-type/view-by-id-payment-type.module').then(m => m.ViewByIdPaymentTypeModule),
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
  declarations: [ViewPaymentTypeComponent],
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
export class ViewPaymentTypeModule { }
