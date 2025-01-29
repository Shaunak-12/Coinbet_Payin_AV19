import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { ApiService } from '@services/api.service';
import { config } from '../../services/config';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

// import { allIcons } from 'angular-feather/icons';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FeatherModule } from 'angular-feather';
@Component({
  selector: 'app-recover-password',
  imports: [
    RouterModule,
    CommonModule,
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
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  
  public recoverPasswordForm!: FormGroup;
  public isAuthLoading = false;
  
  constructor( private renderer: Renderer2, private toastr: ToastrService, private apiservice: ApiService, private formBuilder: FormBuilder, private router: Router) {}
  
  ngOnInit(): void {
      this.renderer.addClass(document.querySelector('app-root'),'login-page');
      this.recoverPasswordForm = this.formBuilder.group({
          password: ['', (Validators.required)],
          confirmPassword: ['', (Validators.required)]
      });
      
  }
  
  recoverPassword() {
      if (this.recoverPasswordForm.invalid) {
          this.toastr.warning('Please fill all fields properly', 'Error!',{positionClass: 'toast-top-center'});
      } else {
          let request = "?ConfrimPassword="+this.recoverPasswordForm.get('confirmPassword')?.getRawValue()+"&NewPassword="+this.recoverPasswordForm.get('password')?.getRawValue();
          this.isAuthLoading = true;
          this.apiservice.getRequest(config['ChangePassword'] + request).subscribe((data: any={}) => {
              this.isAuthLoading = false;   
              if('RStatus' in data && data.RStatus=='Failed'){
                  this.toastr.warning(data.Msg, data.RStatus,{positionClass: 'toast-top-center'});
              }
              else{
                  this.toastr.success('Password Changed!', 'Success!',{positionClass: 'toast-top-center'});
              this.router.navigate(['/']);
              }         
              
          }, (error) => {
              this.isAuthLoading = false;
              console.log(error);
              this.toastr.warning('Please try again', 'Error!',{positionClass: 'toast-top-center'});
          });
          
      }
  }
  
  ngOnDestroy(): void {
      this.renderer.removeClass(document.querySelector('app-root'),'login-page');
  }
}
