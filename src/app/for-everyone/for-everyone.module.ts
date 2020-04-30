import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDataComponent } from './search-data/search-data.component';
import { MenuTableComponent } from './menu-table/menu-table.component';
import { TableComponent } from './table/table.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PipeModule } from '../pipe/pipe.module';



@NgModule({
  declarations: [
    SearchDataComponent,
    MenuTableComponent,
    TableComponent],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    PipeModule
  ],
  exports: [
    SearchDataComponent,
    MenuTableComponent,
    TableComponent
  ]
})
export class ForEveryoneModule { }
