import { AdvanceTablePaginatorComponent } from '@/shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@/shared/advance-table/advance-table.component';
import { TitleHeaderComponent } from '@/shared/title-header/title-header.component';

import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { CommonFunctionService } from '@services/common-function.service';

@Component({
  selector: 'app-chargeback',
  imports: [TitleHeaderComponent,AdvanceTableComponent,AdvanceTablePaginatorComponent,

  ],
  templateUrl: './chargeback.component.html',
  styleUrl: './chargeback.component.scss'
})
export class ChargebackComponent implements OnInit {

  todayDate = new Date();
  dateValue: any=[new Date(),new Date()];
  
  searchOptions = [{name:'All',value:0},{name:'Success',value:1},{name:'Created',value:2}];
  currentQuery:any = [];
  chargebackCollumns:any = [];
  chargebackCollumnLoading = false;
  chargebackCollumnNone:any = [[{value:'No Data Found',bg:'white-drop'}]]
  chargebackCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},
    {value:'RequestId',bg:'white-drop'},
    {value:'Amount',bg:'white-drop'},
    {value:'Name',bg:'white-drop'},
    {value:'Phone',bg:'white-drop'},
    {value:'TransactionId',bg:'white-drop'},
    {value:'Payment Date',bg:'white-drop'},
    {value:'Chargeback Date',bg:'white-drop'}]
  ];

  buttonData=[{name:'Export',disabled:true,value:'export'}]
  
  chargebackData: any=[];
  chargebackRows: any =[];
  
  pageNo=1;
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  
  constructor(private apiservice :ApiService, private utilities : CommonFunctionService) { }
  
  ngOnInit(): void {
    let searchQuery = {
      // "Dates":[this.dateValue[0],this.dateValue[1]],
      // "PageNo": 1,
      // "PageSize": this.pageCount[0],

      "Dates":[this.dateValue[0],this.dateValue[1]],
      "PageNo": 1,
      "PageSize": this.pageCount[0],
      "Search": "",
      "CrpCurrency":"USDT"
    };
    this.currentQuery = searchQuery;
    this.GetChargebackData(this.currentQuery);
  }

  setPaginator(){
    this.paginatorBlock = [];
    if (this.currentQuery.PageNo <= 4) {
      for (let i = 1; i <= 10 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
    else {
      for (let i = this.currentQuery.PageNo - 3; i <= this.currentQuery.PageNo + 6 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
  }
  
  searchChargeback(searchQuery:any){
    this.currentQuery.Dates=searchQuery;
    this.currentQuery.PageNo = 1;
    this.GetChargebackData(this.currentQuery);
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='next'){
      this.currentQuery.PageNo = this.currentQuery.PageNo+1;
    }
    else if(paginatorQuery.action=='previous'){
      this.currentQuery.PageNo = this.currentQuery.PageNo-1;
    }
    else if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetChargebackData(this.currentQuery);
  }
  
  GetChargebackData(searchQuery:any){
    let request = {
      // "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      // "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      // "PageNo": searchQuery.PageNo,
      // "PageSize": searchQuery.PageSize

      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "PageNo": searchQuery.PageNo,
      "Search": searchQuery.Search,
      "PageSize": searchQuery.PageSize,
      "CrpCurrency": searchQuery.CrpCurrency

    };
    this.chargebackRows=[];
    this.chargebackCollumns=[];
    this.buttonData[0].disabled=true;
    this.pagesTotal=1;
    this.chargebackCollumnLoading = true;
    // this.apiservice.sendRequest(config['GetChargebackList'], request).subscribe((data: { TotalCount: number }[]) => {
      this.apiservice.sendRequest(config['GetChargebackList'], request).subscribe((data: any) => {

      this.chargebackCollumnLoading = false;
      this.currentQuery=searchQuery;
      this.chargebackData=data;
      console.log("chargeback data:-", this.chargebackData);
      if(this.chargebackData[0]){
        this.buttonData[0].disabled=false;
        this.chargebackCollumns=this.chargebackCollumnHeaders;
        this.pagesTotal=Math.ceil(this.chargebackData[0].TotalCount/searchQuery.PageSize);
        this.chargebackData.forEach((element:any,index:any) => {
          this.chargebackRows.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.RequestId,bg:'white-cell'},
            {value:this.utilities.roundOffNum(element.Amount),bg:'white-cell'},
            {value:element.Name,bg:'white-cell'},
            {value:element.Phone,bg:'white-cell'},
            {value:element.TransactionId,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'}
          ])
        });
        this.rowCount={f:this.chargebackRows[0][0].value,l:this.chargebackRows[this.chargebackRows.length-1][0].value,t:this.chargebackData[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.chargebackCollumns=this.chargebackCollumnNone;
      }
    }, (error) => {
      this.chargebackCollumnLoading = false;
      console.log(error);
    });
  }  
}