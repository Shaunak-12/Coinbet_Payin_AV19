import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { RoleauthGuard } from '@guards/roleauth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { LoginComponent } from '@modules/login/login.component';
import { MainComponent } from '@modules/main/main.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { ChargebackComponent } from '@pages/chargeback/chargeback.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { DepositComponent } from '@pages/deposit/deposit.component';
import { SettlementComponent } from '@pages/settlement/settlement.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo:'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                canActivate: [RoleauthGuard],
                component: DashboardComponent
            },
            {
                path: 'deposit',
                component: DepositComponent
            },
            {
                path: 'chargeback',
                component: ChargebackComponent
            },
            {
                path: 'settlement',
                canActivate: [RoleauthGuard],
                component: SettlementComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    // {
    //     path: 'register',
    //     component: RegisterComponent,
    //     canActivate: [NonAuthGuard]
    // },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'change-password',
        component: RecoverPasswordComponent,
        canActivate: [AuthGuard]
    },
    {path: '**', redirectTo: ''}
];
