import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css']
})
export class MenuTableComponent implements OnInit {
  @Input()  url: any;
  @Output() conditionEvent = new EventEmitter<boolean>();
  searchEvent = true;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  add() {
    this.router.navigate([this.url[0]]);
  }

  search(){
    this.conditionEvent.emit(this.searchEvent)
  }

}
