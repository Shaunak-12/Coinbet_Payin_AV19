export const config: any = {
    // 'loginApi':'loginApi/UserLogin',
    
    'loginApi':'loginApi/CrpUserLogin',
    // 'loginApi':'loginApi/UserLogin',
    
    // 'GetDashBoardCount':'dashboardApi/GetDashBoardCount',
    'GetDashBoardCount':'crpdashboardApi/CRPGetDashBoardCount',
    // 'GetDeposits':'dashboardApi/GetDeposits',
    'GetDeposits':'crpdashboardApi/CRPGetDeposits',

    // 'GetSettlement':'dashboardApi/GetSettlement',
    // 'GetSettlement':'CRPGetSettlement',

    'GetSettlement':'api/crpdashboard/CRPGetSettlement',

    // 'GetChargebackList':'dashboardApi/GetChargebackList',
    'GetChargebackList':'crpdashboardApi/CRPGetChargebackList',

    // 'DownLoadDepositExcel':'dashboardApi/DownLoadDepositExcel',
    'DownLoadDepositExcel':'crpdashboardApi/CRPDownLoadDepositExcel',
    // 'DownLoadStatementExcel':'dashboardApi/DownLoadStatementExcel',
    'DownLoadStatementExcel':'crpdashboardApi/CRPDownLoadStatementExcel',
    'MakeCallBackAllClient':'api/OtherApi/MakeCallBackAllClient',
    // 'TransferFund':'dashboardApi/TransferFund',
    'TransferFund':'crpdashboard/CRPTransferFund',
    'ChangePassword':'passwordchangeApi/ChangePassword',
    'getRefCodelead':'otherApi/GetRefCode'
 }