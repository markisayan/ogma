import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ProfessorService} from '../../professor/professor.service';
import {Professor, University} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UniversityService} from '../../university/university.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CountryPipe} from '../../country.pipe';
import {GlobalSettingsService} from '../../global-settings.service';
import {Assignment, Course} from '../../org.ogma.academic';
import {CourseService} from '../../course/course.service';
import {AssignmentService} from '../assignment.service';

@Component({
  selector: 'app-assignment-view',
  templateUrl: './assignment-view.component.html',
  styleUrls: ['./assignment-view.component.css']
})
export class AssignmentViewComponent implements OnInit {
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
              private courseService: CourseService,
              private assignmentService: AssignmentService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/assignments/edit';
    this.viewComponentData.what = 'assignment';
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
    return this.assignmentService.getParticipant(id)
      .toPromise()
      .then((assignment: Assignment) => {
        this.viewComponentData.title = assignment.name;
        this.viewComponentData.displayFields = [
          {name: 'date', value: this.datePipe.transform(assignment.date)},
          {name: 'grade required', value: assignment.gradeRequired.toString()},
          {name: 'course', value: assignment.course.name, routerLink: ['/courses/view', assignment.course.courseId]}
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
