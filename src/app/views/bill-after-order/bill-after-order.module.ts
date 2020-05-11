import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BillAfterOrderComponent } from './bill-after-order.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgxPrintModule } from 'ngx-print';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    component: BillAfterOrderComponent,
  }
];

@NgModule({
  declarations: [BillAfterOrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    AlertModule,
    NgxPrintModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class BillAfterOrderModule { }
