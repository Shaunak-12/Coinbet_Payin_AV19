import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import {AppService} from './app.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public headers: any;
  public options: any;
  public headers_object: any;
  private exportLoader = new BehaviorSubject<boolean>(false);
  myVariable$ = this.exportLoader.asObservable();
  
  constructor(public http: HttpClient,private router: Router,private toastr: ToastrService,private appService: AppService) {}

  initHeaders() {
    this.headers_object = new HttpHeaders();
    if (localStorage.getItem('CompanyDetails')) {
      let companyData = JSON.parse(localStorage.getItem('CompanyDetails')||'{}');
      this.headers_object = this.headers_object.append('UserId', companyData['UserId']);
      this.headers_object = this.headers_object.append('LoginToken', companyData['LoginToken']);
      this.headers_object = this.headers_object.append('AdminUserId', companyData['AdminUserId']);
    }
    this.options = {
      headers: this.headers_object
    };
  }

  initHeadersBlob() {
    this.headers_object = new HttpHeaders();
    if (localStorage.getItem('CompanyDetails')) {
      let companyData = JSON.parse(localStorage.getItem('CompanyDetails')||'{}');
      this.headers_object = this.headers_object.append('UserId', companyData['UserId']);
      this.headers_object = this.headers_object.append('LoginToken', companyData['LoginToken']);
      this.headers_object = this.headers_object.append('AdminUserId', companyData['AdminUserId']);
      this.headers_object = this.headers_object.append('responseType', 'blob' as 'json');
    }
    this.options = {
      headers: this.headers_object
    };
  }

  sendRequest(apiEndpoint: string, body?: any) {
    this.initHeaders();
      return this.http.post(environment.apiUrl + apiEndpoint, body, this.options).pipe(
        catchError(error => {
          throw this.handleError(error);
        })
      );
    }
  
    putRequest(apiEndpoint: string, body?: any) {
      this.initHeaders();
      return this.http.put(environment.apiUrl + apiEndpoint, body, this.options).pipe(
        catchError(error => {
          throw this.handleError(error);
        })
      );
    }
  
    getRequest(apiEndpoint: string) {
      this.initHeaders();
      return this.http.get(environment.apiUrl + apiEndpoint, this.options).pipe(
        catchError(error => {
          throw this.handleError(error);
        })
      );
    }

    getRequestBlob(apiEndpoint: string) {
      this.initHeadersBlob();
      return this.http.get(environment.apiUrl + apiEndpoint, this.options).pipe(
        catchError(error => {
          throw this.handleError(error);
        })
      );
    }

    exportExcel = async (apiEndpoint: any,docname:any) => {
      this.exportLoader.next(true);
      let companyData = JSON.parse(localStorage.getItem('CompanyDetails')||'{}');
      let request = {headers: {'LoginToken': companyData['LoginToken'],'UserId': companyData['UserId'],'AdminUserId': companyData['AdminUserId']}};
      fetch(environment.apiUrl+apiEndpoint,request).then((response) => response.blob()).then((blob) => {
        this.exportLoader.next(false);
          let _url = window.URL.createObjectURL(blob);
          const filename = docname;
          const link = document.createElement('a');
          link.href = _url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(_url);
        }).catch((err) => {
          this.exportLoader.next(false);
          this.toastr.warning('','Please try again', {positionClass: 'toast-top-center'});
          console.log(err);
        });
    };
  
    handleError(error: HttpErrorResponse) {
      if(error.status == 401){
        this.toastr.warning('Invalid access detected','Sign In Again !', {positionClass: 'toast-top-center'});
        this.router.navigate(['/login']);
      }
      let errorMsg: string;
      if (error.error instanceof ErrorEvent) {
        errorMsg='An error occurred:', error.error.message;
      } else {
        errorMsg=
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`;
      }
      return throwError(errorMsg);
    }
}
