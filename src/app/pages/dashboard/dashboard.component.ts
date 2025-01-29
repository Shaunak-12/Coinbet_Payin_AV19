import { AdvanceTitleHeadNewComponent } from '@/shared/advance-title-head-new/advance-title-head-new.component';
import { CardListComponent } from '@/shared/card-list/card-list.component';


import {Component, OnInit} from '@angular/core';
import moment from 'moment';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { CommonFunctionService } from '@services/common-function.service'

@Component({
  selector: 'app-dashboard',
  imports: [AdvanceTitleHeadNewComponent,CardListComponent,

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  todayDate = new Date();
  dateDashValue: Date[]=[new Date,new Date];
  dashboardCount: any=[];
  dashboardCountLoading = false;
  dateNew = new Date();
  dynamicControls = [
    {changeAction:'submit',que:'Type',type:'dropdown',options:['TRX'],subque:[]},
    {que:'Date',type:'daterange',minDate:null,maxDate:this.dateNew,startDate:this.dateNew,endDate:this.dateNew,subque:[]},
];
// currentQuery={"StartDateTime": moment(this.dateNew).format("MM-DD-YYYY"),"EndDateTime": moment(this.dateNew).format("MM-DD-YYYY"),"Type":"TRX"};  
currentQuery={"StartDateTime": moment(this.dateNew).format("MM-DD-YYYY"),"EndDateTime": moment(this.dateNew).format("MM-DD-YYYY"),"CrpCurrency":"TRX"};  

  constructor(private apiservice :ApiService, private utilities:CommonFunctionService) {}

  ngOnInit(): void {
    this.GetDashboardCount();
    this.GetCRPWallet();
  }
  GetCRPWallet() {
    let params = {RCType:"CryptoWallets"};
    this.apiservice.sendRequest(config['getRefCodelead'],params).subscribe((data: any) => {
      if(data){
        data.forEach((item: any)=>{
          if(!this.dynamicControls[0].options?.includes(item.RCName)){
            this.dynamicControls[0].options?.push(item.RCName);

          }
        });
      }
    }, (error) => {
      console.log(error);
    });
  }
  
  GetDashboardCount() {
    this.dashboardCount=[];
    this.dashboardCountLoading = true;
    this.apiservice.sendRequest(config['GetDashBoardCount'], this.currentQuery).subscribe((data: any) => {
      this.dashboardCountLoading = false;
      this.dashboardCount = [
        { "name": "Payment Volume", "value":'₹ '+this.utilities.roundOffNum(data.TotalValume), "icon": "ion-person-add", "feather": "user-plus", "color": "#33c38e"},
        { "name": "Transaction Charges", "value":'₹ '+ this.utilities.roundOffNum(data.Charges), "icon": "ion-paper-airplane", "feather": "send", "color": "#ef6767"},
        { "name": "Number of Payment", "value": this.utilities.roundOffNum(data.TotatPaymentCount), "icon": "ion-pie-graph", "feather": "pie-chart", "color": "#1c84ee"},
        { "name": "Number of Request", "value": this.utilities.roundOffNum(data.NumberOfRequest), "icon": "ion-stats-bars", "feather": "bar-chart", "color": "#ffcc5a"},
        { "name": "Withdrawal Balance", "value":'₹ '+ this.utilities.roundOffNum(data.NetBalance), "icon": "ion-pie-graph", "feather": "book", "color": "#1c84ee"},
      ]; 
    }, (error) => {
      this.dashboardCountLoading = false;
      console.log(error);
    });
  }
  getSearchQuery(formVal:any)
  {
    this.currentQuery.CrpCurrency = formVal.Type.value;
    this.currentQuery.StartDateTime = moment(formVal.Date.value1).format("MM-DD-yyyy");
    this.currentQuery.EndDateTime = moment(formVal.Date.value2).format("MM-DD-yyyy");
    this.GetDashboardCount();
  }
}

