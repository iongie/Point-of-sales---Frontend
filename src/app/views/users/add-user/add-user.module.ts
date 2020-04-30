import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { ToastrService } from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    component: AddUserComponent,
  },
];

@NgModule({
  declarations: [AddUserComponent],
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
export class AddUserModule { }
