import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {DepartmentService} from '../../department/department.service';
import {StudentService} from '../student.service';
import {Student} from '../../org.ogma.academic';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  private isDataLoaded = false;
  private listComponentData: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor(
    public studentService: StudentService,
    public snackBar: MatSnackBar,
    public globalSettings: GlobalSettingsService,
    private countryPipe: CountryPipe) { }

  ngOnInit() {
    this.loadAll()
      .then(() => {
        this.isDataLoaded = true;
      });
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.studentService.getAll()
      .toPromise()
      .then((result: Student[]) => {
        this.listComponentData = result.map(student => ({
          image: student.photo,
          title: student.firstName + ' ' + student.lastName,
          subtitle: student.department.name + ' | ' + student.department.university.name + ' | ' + this.countryPipe.transform(student.address.countryCode),
          id: student.studentId
        }));
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
