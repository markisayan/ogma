import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {Assignment, Course} from '../../org.ogma.academic';
import {AssignmentService} from '../assignment.service';
import {CourseService} from '../../course/course.service';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  private isDataLoaded = false;
  private courseIdToName = {};
  private listComponentData: Array<{
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor(
    public courseService: CourseService,
    public assignmentService: AssignmentService,
    public snackBar: MatSnackBar,
    public globalSettings: GlobalSettingsService,
    private countryPipe: CountryPipe) { }

  ngOnInit() {
    this.loadCourses()
      .then(() => {
        return this.loadAll();
      })
      .then(() => {
        this.isDataLoaded = true;
      })
      .catch(error => this.handleError(error));
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.assignmentService.getAll()
      .toPromise()
      .then((result: Assignment[]) => {
        this.listComponentData = result.map(assignment => {
          return {
            title: assignment.name,
            subtitle: this.courseIdToName[assignment.course.courseId],
            id: assignment.assignmentId
          };
        });
        this.isDataLoaded = true;
      });
  }

  loadCourses(): Promise<any> {
    const tempList = [];
    return this.courseService.getAll()
      .toPromise()
      .then((result: Course[]) => {
        result.forEach(course => {
          this.courseIdToName[course.courseId] = course.name;
        });
      });
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
