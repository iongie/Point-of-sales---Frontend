import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.css']
})
export class SearchDataComponent implements OnInit {
  filterData;
  @Output() filter = new EventEmitter<any>();
  @Output() disabledfilters = new EventEmitter<boolean>();
  searchEvent = false;
  constructor() { }

  ngOnInit(): void {
  }

  actionFilter(data){
    this.filter.emit(data);
  }

  disabledFilter() {
    this.disabledfilters.emit(this.searchEvent);
  }

}
