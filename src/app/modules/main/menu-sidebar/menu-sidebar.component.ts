import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import { MenuItemComponent } from '@components/menu-item/menu-item.component';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';

import { FormControl, FormsModule, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
const BASE_CLASSES = 'main-sidebar elevation-4';

@Component({
  selector: 'app-menu-sidebar',
  imports: [MenuItemComponent,
    RouterModule,
    MatProgressSpinnerModule, CommonModule,
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
    MatSlideToggleModule,
    FeatherModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.scss'
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui!: Observable<UiState>;
    public userCompany: any;
    public menu:any = [];

    compnayDetails = localStorage.getItem('CompanyDetails')?JSON.parse(localStorage.getItem('CompanyDetails')||'{}'):{};
    constructor(
        public appService: AppService,
        private store: Store<AppState>
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        let userData=JSON.parse(localStorage.getItem('CompanyDetails')||'{}');
        // this.userCompany = userData.CompanyName.toUpperCase();
        this.userCompany = userData?.CompanyName ? userData.CompanyName.toUpperCase() : 'DEFAULT_COMPANY_NAME';

        if(userData.RoleStatus!='BOCS'){
            this.menu = MENU;
        }
        else{
            this.menu = MENUBOCS;
        }
    }
}

export const MENU = [
    {
        name: 'Dashboard',
        iconClasses: 'home',
        path: ['/dashboard']
    },
    {
        name: 'Deposit',
        iconClasses: 'briefcase',
        path: ['/deposit']
    },
    {
        name: 'Chargeback',
        iconClasses: 'corner-up-right',
        path: ['/chargeback']
    },
    {
        name: 'Settlement',
        iconClasses: 'credit-card',
        path: ['/settlement']
    }
];
export const MENUBOCS = [
    {
        name: 'Deposit',
        iconClasses: 'briefcase',
        path: ['/deposit']
    },
    {
        name: 'Chargeback',
        iconClasses: 'corner-up-right',
        path: ['/chargeback']
    }
];