import { AdvanceTablePaginatorComponent } from '@/shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@/shared/advance-table/advance-table.component';
import { TitleHeaderComponent } from '@/shared/title-header/title-header.component';

import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ApiService } from '../../services/api.service';
import { config } from '../../services/config';
import { CommonFunctionService } from '../../services/common-function.service';
import {ToastrService} from 'ngx-toastr';
// import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';


import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatProgressBarModule } from '@angular/material/progress-bar';

// import { FeatherModule } from 'angular-feather';
// import { allIcons } from 'angular-feather/icons';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-deposit',
  imports: [TitleHeaderComponent,AdvanceTableComponent,AdvanceTablePaginatorComponent,
    RouterModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatInputModule,
        MatNativeDateModule,
        MatTabsModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        FeatherModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatProgressBarModule
  ],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss'
})
export class DepositComponent implements OnInit {
  todayDate = new Date();
  dateValue: any=[new Date(),new Date()];
  exportLoader = false;
  
  buttonData=[{name:'Export',disabled:true,value:'export'}]
  searchOptions = [{name:'All',value:0},{name:'Success',value:1},{name:'Created',value:2}];
  currentQuery:any = [];
  depositCollumns:any = [];
  depositCollumnLoading = false;
  depositCollumnNone:any = [[{value:'No Data Found',bg:'white-drop'}]]
  depositCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},
    {value:'RequestId',bg:'white-drop'},
    {value:'Request Amount',bg:'white-drop'},
    {value:'Paid Amount',bg:'white-drop'},
    {value:'Fees Amount',bg:'white-drop'},
    {value:'Net Amount',bg:'white-drop'},
    {value:'Name',bg:'white-drop'},
    {value:'Phone',bg:'white-drop'},
    {value:'TransactionId',bg:'white-drop'},
    {value:'UTR',bg:'white-drop'},
    {value:'Status',bg:'white-drop'},
    {value:'Mode',bg:'white-drop'},
    {value:'Created Date',bg:'white-drop'},
    {value:'Updated Date',bg:'white-drop'},
    {value:'Action',bg:'white-drop'}]
  ];
  
  depositData: { TransactionId: string, TotalCount?: number }[] = [];
  depositRows: any=[];
  
  pageNo=1;
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  
  constructor(private apiservice :ApiService, private utilities : CommonFunctionService, private toastr: ToastrService) { }
  
  ngOnInit(): void {
    this.apiservice.myVariable$.subscribe((value: boolean) => {
      this.exportLoader=value;
    });

    let searchQuery = {
      "Dates":[this.dateValue[0],this.dateValue[1]],
      "Search": '',
      "intParam1": 0,
      "PageNo": 1,
      "PageSize": this.pageCount[0],

      // added by shaunak
      // "intParam1": 2,
      "CrpCurrency":"USDT"
    };
    this.currentQuery = searchQuery;
    this.GetDepositData(this.currentQuery);
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
  
  searchDeposit(searchQuery:any){
    this.currentQuery.Dates=searchQuery.Dates;
    this.currentQuery.Search=searchQuery.searchInput;
    this.currentQuery.intParam1=searchQuery.Option;
    this.currentQuery.PageNo = 1;
    this.GetDepositData(this.currentQuery);
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
    this.GetDepositData(this.currentQuery);
  }
  
  GetDepositData(searchQuery:any){
    let request = {
      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "Search": searchQuery.Search,
      "intParam1": searchQuery.intParam1,
      "PageNo": searchQuery.PageNo,
      "PageSize": searchQuery.PageSize,

      // added by shaunak
      "CrpCurrency": searchQuery.CrpCurrency
    };
    this.depositRows=[];
    this.depositCollumns=[];
    this.pagesTotal=1;
    this.buttonData[0].disabled=true;
    this.depositData=[];
    this.depositCollumnLoading = true;
    this.apiservice.sendRequest(config['GetDeposits'], request).subscribe((data: any) => {
      this.depositCollumnLoading = false;
      this.currentQuery=searchQuery;
      this.depositData=data;
      if(this.depositData[0]){
        this.buttonData[0].disabled=false;
        this.depositCollumns=this.depositCollumnHeaders;
        this.pagesTotal=this.depositData[0] && this.depositData[0].TotalCount ? Math.ceil(this.depositData[0].TotalCount/searchQuery.PageSize) : 1;
        this.depositData.forEach((element:any,index:any) => {
          this.depositRows.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.RequestId,bg:'white-cell'},
            {value:this.utilities.roundOffNum(element.Amount),bg:'white-cell'},
            {value:element.PaidAmount?this.utilities.roundOffNum(element.PaidAmount):'',bg:'white-cell'},
            {value:element.FeesAmount?this.utilities.roundOffNum(element.FeesAmount):'',bg:'white-cell'},
            {value:element.NetAmount?this.utilities.roundOffNum(element.NetAmount):'',bg:'white-cell'},
            {value:element.Name,bg:'white-cell'},
            {value:element.Phone,bg:'white-cell'},
            {value:element.TransactionId,bg:'white-cell'},
            ... (!element.TempUTR ? [{value:element.ReferenceId,bg:'white-cell'}]:[{value:element.ReferenceId,bg:'white-cell',sufText:'Temp : '+element.TempUTR}]),
            {value:element.TransactionStatus,bg:'white-cell'},
            {value:element.PaymentMode,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'},
            {value:element.PGOrderId?'CallBack':'',bg:'white-cell',icon:element.PGOrderId?'None':''}
          ])
        });
        this.rowCount={
          f: this.depositRows.length > 0 ? this.depositRows[0][0].value : 0,
          l: this.depositRows.length > 0 ? this.depositRows[this.depositRows.length-1][0].value : 0,
          t: this.depositData.length > 0 && this.depositData[0].TotalCount ? this.depositData[0].TotalCount : 0
        };
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.depositCollumns=this.depositCollumnNone;
      }      
    }, (error) => {
      this.depositCollumnLoading = false;
      console.log(error);
    });
  }
  
  onValueChange(val:any){
    if(val.col==14){      
      let request = "?TransactionId="+ this.depositData[val.row].TransactionId;
      this.depositRows[val.row][val.col].icon='Loading';
      this.apiservice.getRequest(config['MakeCallBackAllClient'] + request).subscribe((data: any) => {
        this.depositRows[val.row][val.col].icon='None';
        if(data.ErrorCode=='1'){
          window.open(data.Result, '_blank')?.focus();
        }
        else{
          this.toastr.clear();
          this.toastr.warning(this.depositData[val.row].TransactionId,data.ErrorMessage, {positionClass: 'toast-top-center'});
        }
      }, (error) => {
        this.depositRows[val.row][val.col].icon='None';
        console.log(error);
      });
    }
    
  }
  
  btnGridAction(){
    this.DownloadDepositData();
  }
  
  DownloadDepositData() {
    let request = "?Search="+ this.currentQuery.Search + "&intParam1="+ this.currentQuery.intParam1 + "&StartDateTime=" + moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy") + "&EndDateTime=" + moment(this.currentQuery.Dates[1]).format("DD/MM/yyyy") + "&CrpCurrency=" + this.currentQuery.CrpCurrency;
    let docname = 'Deposit_Download_'+moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy");
    this.apiservice.exportExcel(config['DownLoadDepositExcel'] + request,docname);
  }
  
}
