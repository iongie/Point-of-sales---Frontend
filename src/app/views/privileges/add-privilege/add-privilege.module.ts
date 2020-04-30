import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddPrivilegeComponent } from './add-privilege.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ToastrService } from 'ngx-toastr';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    component: AddPrivilegeComponent,
  },
];

@NgModule({
  declarations: [AddPrivilegeComponent],
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
export class AddPrivilegeModule { }
