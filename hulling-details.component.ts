import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hulling-details',
  templateUrl: './hulling-details.component.html',
  styleUrls: ['./hulling-details.component.css']
})
export class HullingDetailsComponent implements OnInit {
  hullingDetailsCols: any;
  hullingDetailsData: any;
  fromDate: any;
  toDate: any;
  maxDate: Date;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, 
    private excelService: ExcelService, private restAPIService: RestAPIService,
     private router: Router) { }

  ngOnInit() {
    this.hullingDetailsCols = this.tableConstants.HullingDetailsReport;
    this.maxDate = new Date();
  }

  onView() {
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'))
	.append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')));
    this.restAPIService.getByParameters(PathConstants.HULLING_DETAILS_REPORT, params).subscribe(res => {
      this.hullingDetailsData = res;
      let sno = 0;
      this.hullingDetailsData.forEach(data => {
        data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && this.hullingDetailsData.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })  }



  
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.hullingDetailsData, 'Write_Off', this.hullingDetailsCols);
  }
}
