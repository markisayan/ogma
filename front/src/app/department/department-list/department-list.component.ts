import { Component, OnInit } from '@angular/core';
import {Department, University} from '../../org.ogma.participant';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {DepartmentService} from '../department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  private isDataLoaded = false;
  private listComponentData: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor(
    public departmentService: DepartmentService,
    public snackBar: MatSnackBar,
    public globalSettings: GlobalSettingsService,
    private countryPipe: CountryPipe) { }

  ngOnInit() {
    this.loadAll();
  }


  loadAll(): Promise<any> {
    const tempList = [];
    return this.departmentService.getAll()
      .toPromise()
      .then((result: Department[]) => {
        this.listComponentData = result.map(department => ({
          image: department.logo,
          title: department.name,
          subtitle: department.university.name,
          id: department.departmentId
        }));
        this.isDataLoaded = true;
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
