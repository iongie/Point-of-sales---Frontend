import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
  }
];

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    AlertModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class CartModule { }
