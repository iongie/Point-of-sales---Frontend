import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectServerService } from '../../../services/connect-server/connect-server.service';
import { of, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-kitchen-type',
  templateUrl: './add-kitchen-type.component.html',
  styleUrls: ['./add-kitchen-type.component.css']
})
export class AddKitchenTypeComponent implements OnDestroy {
  dataKitchenType: any = {};
  dateHistory = new Date();
  private subs: Subject<void> = new Subject();
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    public connectServ: ConnectServerService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy() {
    this.subs.next();
    this.subs.complete();
  }

  onSubmit(){
    this.connectServ.profile$.pipe(take(1)).subscribe(res => {
      of(this.data(res[0].profileId)).subscribe(()=> {
        this.router.navigate(['/kitchen-type']);
      })
    })
    this.connectServ.readDataProfile();
  }

  data(profileId) {
    let sendData = {
      numberOfTable: 1,
      response: "response-add-kitchen-type",
      action: {
        table: 'add',
        upload: false,
        join: false,
        createDataOffline: true
      },
      create: [
        {
          table:"kitchen_type",
          data: {
            kitchenTypeName: this.dataKitchenType.name
          },
          condition: {
            read: false,
            insertId: false,
            processAddJoin: false,
            addMultiJoin: false,
          },
          response: "response-add-kitchen-type",
          toast: {
            name:  "response-add-kitchen-type",
            type: 'add-non-join',
            messageToastSuccess: 'Added data kitchen type successfully',
            messageToastError: 'Added data kitchen type not successfully'
          }
        },
        {
          table:"history_app",
          data: {
            date:  this.datePipe.transform(this.dateHistory, 'yyyy-MM-dd'),
            time: this.datePipe.transform(this.dateHistory, 'h:mm:ss a'),
            description: "Added data kitchen type"
          },
          condition: {
            read: false,
            insertId: true,
            processAddJoin: true,
            addMultiJoin: true,
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
        table: "kitchen-type",
        response: "response-kitchen-type"
      },
      uploadOffline: {
        filePath: "kitchenType.json"
      },
    };
    if(navigator.onLine) {
      this.connectServ.read(sendData)
    } else if (!navigator.onLine) {
      this.connectServ.saveOfflineData('add_kitchen_type', sendData);
    }
  }

  goToList(){
    this.router.navigate(['kitchen-type']);
  } 

}
