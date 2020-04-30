import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewDiningTableComponent } from './view-dining-table.component';
import { AuthGuard } from '../../../services/guard/auth/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dining table'
    },
    children: [
      {
        path: '',
        data: {
          title: 'Views'
        },
        component: ViewDiningTableComponent,
      },
      {
        path: 'add',
        loadChildren: () => import('../add-dining-table/add-dining-table.module').then(m => m.AddDiningTableModule),
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
            loadChildren: () => import('../view-by-id-dining-table/view-by-id-dining-table.module').then(m => m.ViewByIdDiningTableModule),
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
  declarations: [ViewDiningTableComponent],
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
export class ViewDiningTableModule { }
