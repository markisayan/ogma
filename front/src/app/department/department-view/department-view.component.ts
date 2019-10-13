import {Component, OnInit} from '@angular/core';
import {Department, University} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../department.service';
import {GlobalSettingsService} from '../../global-settings.service';
import {DatePipe} from '@angular/common';
import {CountryPipe} from '../../country.pipe';
import {UniversityService} from '../../university/university.service';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.css']
})
export class DepartmentViewComponent implements OnInit {
  private viewComponentData: {
    title?: string,
    editLink?: string,
    id?: string,
    image?: string,
    isDataLoaded?: boolean,
    what?: string,
    displayFields?: Array<{
      name: string,
      value: string,
      link?: string,
      routerLink?: Array<string>
    }>
  };
  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private universityService: UniversityService,
              private departmentService: DepartmentService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/departments/edit';
    this.viewComponentData.what = 'department';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.viewComponentData.id = id;
    this.load(id)
      .then(() => {
        this.viewComponentData.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.departmentService.getParticipant(id)
      .toPromise()
      .then((department: Department) => {
        this.viewComponentData.image = department.logo;
        this.viewComponentData.title = department.name;
        this.viewComponentData.displayFields = [
          {name: 'head', value: department.headFirstName + ' ' + department.headLastName},
          {name: 'opening date', value: this.datePipe.transform(department.openingDate)},
          {name: 'email', value: department.email, link: 'mailto:' + department.email},
          {name: 'website', value: department.websiteUrl, link: department.websiteUrl},
          {name: 'phone', value: department.phone},
          {
            name: 'address',
            value: [department.address.address1, department.address.address2, department.address.city, department.address.state, this.countryPipe.transform(department.address.countryCode)].join(', ')
          },
          {name: 'university', value: department.university.name, routerLink: ['/universities/view', department.university.universityId]},
        ];
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    let errorMessage;

    if (error === 'Server error') {
      errorMessage = 'Could not connect to server';
    } else {
      errorMessage = error.message || error;
    }
    this.snackBar.open(errorMessage, 'Close', {
      duration: 2000
    });
  }
}
