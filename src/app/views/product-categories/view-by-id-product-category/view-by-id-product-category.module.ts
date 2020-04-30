import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ViewByIdProductCategoryComponent } from './view-by-id-product-category.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { ToastrService } from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    component: ViewByIdProductCategoryComponent,
  },
];

@NgModule({
  declarations: [ViewByIdProductCategoryComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AlertModule.forRoot()
  ],
  providers: [
    DatePipe,
    ConnectServerService,
    ToastrService
  ]
})
export class ViewByIdProductCategoryModule { }
