import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { config } from './config';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public user: any = null;
    private authLoader = new BehaviorSubject<boolean>(false);
    myVariable$ = this.authLoader.asObservable();
    
    constructor(private router: Router, private toastr: ToastrService, private apiservice :ApiService) {}
    
    async loginByAuth({email, password}: {email: string, password: string}) {
        try {
            let param = '?Email='+email+'&Password='+password;
            this.authLoader.next(true);
            this.apiservice.getRequest(config['loginApi'] + param).subscribe((response: any) => {
                this.authLoader.next(false);
                if(response.ErrorCode==1){
                  console.log("1");
                    let companyDetails = {CompanyName: response.CompanyName,AdminUserId: response.AdminUserId,LoginToken: response.LoginToken,UserId: response.UserId,RoleStatus: response.RoleStatus}
                    localStorage.setItem('CompanyDetails', JSON.stringify(companyDetails));
                    console.log("2");

                    this.router.navigate(['/']);
                    console.log("3");

                }
                else{
                    this.toastr.error('',response.response.Msg,{positionClass: 'toast-top-center'});
                    console.log("4 error");

                    localStorage.clear();
                }
            })
        } catch (error: any) {
            this.authLoader.next(false);
            console.log(error);
            this.toastr.error(error.message);
        }
    }
        
    logout() {
        localStorage.removeItem('CompanyDetails');
        this.user = null;
        this.router.navigate(['/login']);
    }
}

