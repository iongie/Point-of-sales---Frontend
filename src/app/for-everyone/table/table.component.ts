import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  @Input()  header: any;
  @Input()  headerImage: any;
  @Output() updateKey = new EventEmitter<any>();
  @Output() deleteKey = new EventEmitter<any>();
  data: any = [];

  itemData: any = [];
  page;
  addPage;
  loadMoreButton = false;
  filterData;

  private subs = new Subject<any>();
  constructor(
    private connectServ: ConnectServerService
  ) { }

  ngOnInit(): void {
    this.read();
    this.connectServ.filterData$.pipe(takeUntil(this.subs)).subscribe(resFilter => {
      this.filterData = resFilter;
    })
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  read() {
    this.connectServ.changeData$.pipe(takeUntil(this.subs)).subscribe(res => {
      // this.data = res;

      this.itemData= res;
      this.page = 15;
      this.data = this.itemData.slice(0, this.page);
      
      this.buttonLoadMore(this.data, this.itemData, this.page);
    })
  }

  update(i) {
    this.updateKey.emit(i);
  }

  delete(i) {
    this.deleteKey.emit(i);
  }

  loadMore() {
    let userLength = this.data.length;
    let banding = this.itemData.length-userLength; 
    this.addPage = 3;
    if (banding < this.addPage ) {
      this.page = userLength+banding;
    } else {
      this.page = userLength+this.addPage;
    }
    this.data = this.itemData.slice(0, this.page);
    this.buttonLoadMore(this.data, this.itemData, this.page);  
  }

  buttonLoadMore(data, itemData, page){
    if(data.length < page ){
      this.loadMoreButton = false;
    }else if(data.length < itemData.length){
      this.loadMoreButton = true;
    } else if(data.length = itemData.length){
      this.loadMoreButton = false;
    } else {
      this.loadMoreButton = false;
    }
  }

}
