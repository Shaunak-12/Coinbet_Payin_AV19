
import { Component, OnInit, OnDestroy, Renderer2, HostBinding } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';

// defineCustomElements();
registerLocaleData(localeEn, 'en-EN');

@Component({
  selector: 'app-login',
  imports: [
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
    MatProgressBarModule,
    BrowserAnimationsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  public loginForm!: UntypedFormGroup;
  public isAuthLoading = false;
  public isGoogleLoading = false;
  public isFacebookLoading = false;
  siteUrl = (window.location.hostname).substring((window.location.hostname).indexOf(".") + 1);
  
  passwordType = 'password';
  eyeType = 'eye';
  
  constructor(private renderer: Renderer2, private toastr: ToastrService, private appService: AppService) {if(localStorage.getItem('CompanyDetails')){localStorage.removeItem('CompanyDetails')}}
  
  ngOnInit() {
    this.appService.myVariable$.subscribe((value: boolean) => {
      this.isAuthLoading=value;
    });
    this.renderer.addClass(document.querySelector('app-root'),'login-page');
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required)
    });
  }
  
  async loginByAuth() {
    if (this.loginForm.valid) {
      await this.appService.loginByAuth(this.loginForm.value);
    } else {
      this.toastr.error('Form is not valid!','',{positionClass: 'toast-top-center'});
    }
  }
  
  togglePassVisible(){
    if(this.passwordType == 'password')
    {
      this.passwordType = 'text';
      this.eyeType = 'eye-off';
    }
    else
    {
      this.passwordType = 'password';
      this.eyeType = 'eye';
    }
  }
  
  ngOnDestroy() {
    this.renderer.removeClass(document.querySelector('app-root'),'login-page');
  }
}