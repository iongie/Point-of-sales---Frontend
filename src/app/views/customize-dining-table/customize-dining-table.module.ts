import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomizeDiningTableComponent } from './customize-dining-table.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForEveryoneModule } from '../../for-everyone/for-everyone.module';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Routes = [
  {
    path: '',
    component: CustomizeDiningTableComponent,
  },
];

@NgModule({
  declarations: [CustomizeDiningTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ForEveryoneModule,
    DragDropModule,
  ],
  providers: [
    ConnectServerService,
    DatePipe
  ]
})
export class CustomizeDiningTableModule { }
