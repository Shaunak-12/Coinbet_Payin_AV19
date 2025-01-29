import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {MatDatepicker} from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import {Validators,FormControl,FormsModule,FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

import _moment from 'moment';

import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MMMM YYYY',
  },
};

@Component({
  selector: 'app-title-header',
  imports: [
    MatProgressSpinnerModule,CommonModule,
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
        // FeatherModule.pick(allIcons),
        MatCheckboxModule,
        MatExpansionModule,
        MatProgressBarModule
  ],
  templateUrl: './title-header.component.html',
  styleUrl: './title-header.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class TitleHeaderComponent implements OnInit {
  
  @Input() titleText:string ='';
  @Input() classes:string ='';
  @Input() searchType:string ='';
  @Input() DateObj:any={};
  @Input() searchOptions:any=[];
  @Input() maxDate!: Date;
  @Input() addButton!: boolean | false;
  @Input() exportLoader!: boolean | false;
  @Input() searchHasOption!: boolean | false;
  @Input() searchButton!: boolean;
  @Input() startEndDates: Date[] = [];
  @Input() searchHasInputOption!: boolean | false;
  @Input() showExport!: boolean | false;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onExport = new EventEmitter<any>();

  inputOptionSelected = new FormControl('');
  inputSearchBox = new FormControl('');

  newMonthSelected = new FormControl(moment().startOf('month'));
  newYearSelected = new FormControl(moment().startOf('year'));

  dateValues: Date[] = [];
  DateType=[{name:'Daily',value:'D'},{name:'Monthly',value:'M'},{name:'Yearly',value:'Y'}];

  constructor() { }

  ngOnInit(): void {
    this.dateValues=this.startEndDates;
    if(this.searchOptions.length>0){
      this.inputOptionSelected.setValue(this.searchOptions[0].value);
      if(this.searchType=='customSearch'){
        this.inputOptionSelected.valueChanges.subscribe((data)=>{
          this.searchCustomFunction();
        });
      }
    }
  }

  searchFunction(){
    let searchQuery:any = this.dateValues;
    if(this.searchHasOption && this.searchOptions.length!=0){
      searchQuery = {Dates:this.dateValues,Option:this.inputOptionSelected.getRawValue()}
    }
    if(this.searchHasInputOption){
      searchQuery = {...searchQuery,searchInput:this.inputSearchBox.getRawValue()}
    }
    this.onSearch.emit(searchQuery);
  }

  searchObjFunction(){
    let SelectedDateTime = this.DateObj.StartDateTime;
    if(this.DateObj.Type=='M'){
      SelectedDateTime = this.newMonthSelected.getRawValue();
    }
    else if(this.DateObj.Type=='Y'){
      SelectedDateTime = this.newYearSelected.getRawValue();
    }
    let ParseDateValue = {
      Type:this.DateObj.Type,
      StartDateTime:SelectedDateTime
    }
    this.onSearch.emit(ParseDateValue);
  }

  searchCustomFunction(){
    let searchQuery:any = this.dateValues;
    if(this.searchHasOption && this.searchOptions.length!=0){
      searchQuery = {Dates:this.dateValues,Option:this.inputOptionSelected.getRawValue()}
    }
    if(this.searchHasInputOption){
      searchQuery = {...searchQuery,searchInput:this.inputSearchBox.getRawValue()}
    }
    this.onSearch.emit(searchQuery);
  }

  addFunction(){
    this.onAdd.emit();
  }

  exportPressed(){
    this.onExport.emit();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.newMonthSelected.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.newMonthSelected.setValue(ctrlValue);
    datepicker.close();
  }

  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.newYearSelected.value!;
    ctrlValue.year(normalizedYear.year());
    this.newYearSelected.setValue(ctrlValue);
    datepicker.close();
  }
}