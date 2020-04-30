import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
  }
];

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    AlertModule,
    RouterModule.forChild(routes),
    TabsModule,
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class PaymentModule { }
