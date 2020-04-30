import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    AlertModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class DashboardModule { }
