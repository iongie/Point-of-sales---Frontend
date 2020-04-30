import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddKitchenTypeComponent } from './add-kitchen-type.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { ToastrService } from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    component: AddKitchenTypeComponent,
  },
];

@NgModule({
  declarations: [AddKitchenTypeComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AlertModule.forRoot(),
  ],
  providers: [
    DatePipe,
    ConnectServerService,
    ToastrService
  ]
})
export class AddKitchenTypeModule { }
