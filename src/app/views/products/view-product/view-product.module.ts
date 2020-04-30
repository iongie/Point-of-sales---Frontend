import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewProductComponent } from './view-product.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Products'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewProductComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-product/add-product.module').then(m => m.AddProductModule),
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
            loadChildren: () => import('../view-by-id-product/view-by-id-product.module').then(m => m.ViewByIdProductModule),
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
  declarations: [ViewProductComponent],
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
export class ViewProductModule { }
