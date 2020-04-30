import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewKitchenTypeComponent } from './view-kitchen-type.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';

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
        component: ViewKitchenTypeComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-kitchen-type/add-kitchen-type.module').then(m => m.AddKitchenTypeModule),
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
            loadChildren: () => import('../view-by-id-kitchen-type/view-by-id-kitchen-type.module').then(m => m.ViewByIdKitchenTypeModule),
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
  declarations: [ViewKitchenTypeComponent],
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
export class ViewKitchenTypeModule { }
