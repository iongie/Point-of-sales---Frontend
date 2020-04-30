import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewProductCategoryComponent } from './view-product-category.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Product category'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewProductCategoryComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-product-category/add-product-category.module').then(m => m.AddProductCategoryModule),
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
            loadChildren: () => import('../view-by-id-product-category/view-by-id-product-category.module').then(m => m.ViewByIdProductCategoryModule),
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
  declarations: [ViewProductCategoryComponent],
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
export class ViewProductCategoryModule { }
