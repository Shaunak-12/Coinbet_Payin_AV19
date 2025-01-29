import { Injectable } from '@angular/core';
import moment from 'moment';
import saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable(
{
    providedIn: 'root', // This ensures the service is globally available
})

export class CommonFunctionService {
    storageData: any = {};
    PageName: any;
    constructor(private toastr: ToastrService) { }

    toastMsg(type: string, title: string, msg: string) {
        if (type == 'success') {
            this.toastr.success(msg, title, { positionClass: 'toast-top-center' });
        }
        if (type == 'error') {
            this.toastr.error(msg, title, { positionClass: 'toast-top-center' });
        }
        if (type == 'warning') {
            this.toastr.warning(msg, title, { positionClass: 'toast-top-center' });
        }
    }

    roundOffNum(numData: any) {
        let signage = '';
        if (numData && numData < 0) {
            signage = '-';
            numData = Math.abs(numData);
        }
        if (numData && ((numData % 1) != 0)) {
            let x = numData.toFixed(2);
            x = x.toString();
            let afterPoint = '';
            if (x.indexOf('.') > 0) {
                afterPoint = x.substring(x.indexOf('.'), x.length);
            }
            x = Math.floor(x);
            x = x.toString();
            let lastThree = x.substring(x.length - 3);
            let otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers != '') {
                lastThree = ',' + lastThree;
            }
            let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
            return (signage + res);
        }
        else if (numData) {
            let x = numData;
            x = x.toString();
            let lastThree = x.substring(x.length - 3);
            let otherNumbers = x.substring(0, x.length - 3);
            if (otherNumbers != '') {
                lastThree = ',' + lastThree;
            }
            let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            return (signage + res);
        }
        else {
            return ('0.00');
        }
    }
}
