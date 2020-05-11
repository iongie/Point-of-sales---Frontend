import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { Subject, of } from 'rxjs';
import { ConnectServerService } from '../../services/connect-server/connect-server.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';
import { CdkDragEnd } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-customize-dining-table',
  templateUrl: './customize-dining-table.component.html',
  styleUrls: ['./customize-dining-table.component.css']
})
export class CustomizeDiningTableComponent implements OnInit, OnDestroy {
  diningTable: any = [];
  position: any = [];
  private subs: Subject<void> = new Subject();
  dateHistory = new Date();
  @ViewChildren('i') cek: QueryList<ElementRef>;
  constructor(
    public connectServ: ConnectServerService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataDiningTable();
    this.readDiningTable();
  }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  dataDiningTable() {
    let sendData = {
      numberOfTable: 1,
      action: {
        table: 'read',
        upload: false,
        join: false,
      },
      read: {
        table: "dining_table",
        response: "response-dining-table"
      }
    };
    this.connectServ.readTwo(sendData)
  }

  readDiningTable() {
    this.connectServ.responseTwo$.pipe(takeUntil(this.subs)).subscribe(res => {
      this.diningTable = res.data.map(x => {
        const data = {
          diningTableId: x.diningTableId,
          diningTableName: x.name,
          diningTablePosition: x.position
        }
        return data;
      });
    })
  }
  

  dragEnd(event: CdkDragEnd, i) {
    this.position = this.cek.toArray().map((x, i) => {
       const data = {
         id: this.diningTable[i].diningTableId,
         name: this.diningTable[i].diningTableName,
         position: x.nativeElement.style.transform
       };
       return data
    });

    const z = this.position.filter((z, i)=> {
      return z.position !== this.diningTable[i].diningTablePosition;
    })

    console.log(this.position);
    
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      of(this.dataUpdate(z[0].id, res[0].profileId, z[0].position, z[0].name)).pipe(takeUntil(this.subs)).subscribe(()=> {
        this.position = [];
      })
    });
    this.connectServ.readDataProfile();
  }

  dataUpdate(paramsId, profileId, diningTablePosition, diningTableName) {
    console.log(diningTablePosition, diningTableName);
    
    let sendDataUpdate = {
      numberOfTable: 1,
      action: {
        table: "update",
        upload: false,
        join: false,
        createDataOffline: true
      },
      create:[
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Customize position dining table"
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true
          },
          response: "response-add-history",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
          result: null,
          sendCreateJoinId: {
            key: 0,
            name: "historyAppId"
          }
        } 
      ],
      update:[
        {
          table: "dining_table",
          tableId: {
            name: "diningTableId",
            data: paramsId
          },
          data: "name='"+diningTableName+"',position='"+diningTablePosition+"'",
          condition: {
            read: false
          },
          response: "response-update-dining-table",
          toast: {
            name:  "response-update-dining-table",
            type: 'add-non-join',
            messageToastSuccess: 'Customize position dining table successfully',
            messageToastError: 'Customize position dining table not successfully'
          }
        }  
      ],
      createJoinId: [
        {
          table: "history_profile",
          data: {
            profileId: profileId
          },
          condition: {
            read: false,
            insertId: false
          },
          response: "response-add-history-profile",
          toast: {
            name:  null,
            type: null,
            messageToastSuccess: null,
            messageToastError: null
          },
        }
      ],
      read: {
        table: "dining_table",
        response: "response-read-dining-table"
      },
      uploadOffline: {
        filePath: "diningTable.json"
      }
    };
    this.connectServ.read(sendDataUpdate)
  }

}
