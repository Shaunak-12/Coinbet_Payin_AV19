import {AppState} from '@/store/state';
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';
import {ApiService} from '@services/api.service';
import {config} from '@services/config';
import {CommonFunctionService} from '@services/common-function.service';


import { Router, RouterModule } from '@angular/router';



import { FormControl, FormBuilder, FormGroup, FormsModule } from '@angular/forms';

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
const BASE_CLASSES = 'main-header navbar navbar-expand';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule, MatProgressSpinnerModule, CommonModule,
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
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui!: Observable<UiState>;
  public searchForm!: UntypedFormGroup;

  constructor(
      private appService: AppService,
      private store: Store<AppState>
  ) {}

  ngOnInit() {
      this.ui = this.store.select('ui');
      this.ui.subscribe((state: UiState) => {
          this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
      });
      this.searchForm = new UntypedFormGroup({
          search: new UntypedFormControl(null)
      });
  }

  logout() {
      this.appService.logout();
  }

  onToggleMenuSidebar() {
      this.store.dispatch(new ToggleSidebarMenu());
  }

  onToggleControlSidebar() {
      this.store.dispatch(new ToggleControlSidebar());
  }
}
