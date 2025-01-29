import { AdvanceTablePaginatorComponent } from '@/shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@/shared/advance-table/advance-table.component';
import { TitleHeaderComponent } from '@/shared/title-header/title-header.component';

import moment from 'moment';

import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { CommonFunctionService } from '@services/common-function.service';


import { Component, OnInit, OnDestroy, Renderer2, HostBinding } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl,FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '@services/app.service';


import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
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
  selector: 'app-settlement',
  imports: [TitleHeaderComponent,AdvanceTableComponent, AdvanceTablePaginatorComponent,
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
  templateUrl: './settlement.component.html',
  styleUrl: './settlement.component.scss'
})
export class SettlementComponent implements OnInit {
  todayDate = new Date();
  dateValue: any=[new Date(),new Date()];
  exportLoader = false;

  searchOptions = [{name:'All',value:0},{name:'Success',value:1},{name:'Created',value:2}];
  currentQuery:any = [];
  settlementCollumns:any = [];
  settlementCollumnLoading = false;
  settlementCollumnNone:any = [[{value:'No Data Found',bg:'white-drop'}]];
  settlementCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},
    {value:'Description',bg:'white-drop'},
    {value:'Amount',bg:'white-drop'},
    {value:'Balance',bg:'white-drop'},
    {value:'Date',bg:'white-drop'}]
  ];
  
  buttonData=[{name:'Export',disabled:true,value:'export'}]
  
  settlementData: any[] = [];
  settlementRows: any=[];
  
  pageNo=1;
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  
  transferBtn=true;
  trxLoading = false;
  
  payoutAmount = new FormControl(0.00,Validators.required);
  
  constructor(private apiservice :ApiService, private utilities: CommonFunctionService) { }
  
  ngOnInit(): void {
    this.apiservice.myVariable$.subscribe((value: boolean) => {
      this.exportLoader=value;
    });

    let searchQuery = {
      "Dates":[this.dateValue[0],this.dateValue[1]],
      "PageNo": 1,
      "PageSize": this.pageCount[0],

      // added by shaunak
      "CryptoCurrency":"USDT"


    };
    this.currentQuery = searchQuery;
    this.GetSettlementData(this.currentQuery);
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
  
  toggleTransferBtn(){
    this.transferBtn=false;
  }
  
  initiateTrx(){
    let request = {
      Amount: this.payoutAmount.getRawValue()
    };
    this.trxLoading = true;
    this.apiservice.sendRequest(config['TransferFund'], request).subscribe((data: any) => {
      this.trxLoading = false;
      if(data.ErrorCode=='1'){
        this.utilities.toastMsg('success', 'Success!', data.ErrorMessage);
        this.GetSettlementData(this.currentQuery);
        this.transferBtn=true;
      }
      else{
        this.utilities.toastMsg('warning', 'Try Again!','');
      }
    }, (error) => {
      this.trxLoading = false;
      this.utilities.toastMsg('error', 'Try Again!','');
      console.log(error);
    });
    
  }
  
  searchSettlement(searchQuery:any){
    this.currentQuery.Dates=searchQuery;
    this.currentQuery.PageNo = 1;
    this.GetSettlementData(this.currentQuery);
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
    this.GetSettlementData(this.currentQuery);
  }
  
  GetSettlementData(searchQuery:any){
    let request = {
      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "PageNo": searchQuery.PageNo,
      "PageSize": searchQuery.PageSize,

      // added by shaunak
      "CryptoCurrency":"USDT"
    };
    this.settlementRows=[];
    this.settlementCollumns=[];
    this.buttonData[0].disabled=true;
    this.pagesTotal=1;
    this.settlementCollumnLoading = true;
    this.apiservice.sendRequest(config['GetSettlement'], request).subscribe((data: any) => {
      this.settlementCollumnLoading = false;
      this.currentQuery=searchQuery;
      this.settlementData=data;
      if(this.settlementData[0]){
        this.buttonData[0].disabled=false;
        this.settlementCollumns=this.settlementCollumnHeaders;
        if(!this.settlementData[0].IsRunningBalanceVisible&&this.settlementCollumns[0][3].value=='Balance'){
          this.settlementCollumns[0].splice(3, 1);
        }
        this.pagesTotal=Math.ceil(this.settlementData[0].TotalCount/searchQuery.PageSize);
        this.settlementData.forEach((element:any,index:any) => {
          this.settlementRows.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.Description,bg:'white-cell'},
            {value:this.utilities.roundOffNum(element.Amount),bg:'white-cell'},
            ... (element.IsRunningBalanceVisible ? [{value:element.Balance,bg:'white-cell'}]:[]),
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss a DD MMM yyyy"):'',bg:'white-cell'}
          ])
        });
        this.rowCount={f:this.settlementRows[0][0].value,l:this.settlementRows[this.settlementRows.length-1][0].value,t:this.settlementData[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.settlementCollumns=this.settlementCollumnNone;
      }
    }, (error) => {
      this.settlementCollumnLoading = false;
      console.log(error);
    });
  }
  
  btnGridAction(){
      this.DownloadSettlementData();
  }
  
  DownloadSettlementData() {
    let request = "?StartDateTime=" + moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy") + "&EndDateTime=" + moment(this.currentQuery.Dates[1]).format("DD/MM/yyyy") + "&CrpCurrency=" + this.currentQuery.CryptoCurrency;
    let docname = 'Statement_Download_'+moment(this.currentQuery.Dates[0]).format("DD/MM/yyyy");
    this.apiservice.exportExcel(config['DownLoadStatementExcel'] + request,docname);
  }
}