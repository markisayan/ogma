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
import {CourseService} from '../course.service';
import {Course} from '../../org.ogma.academic';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent implements OnInit {
  private viewComponentData: {
    title: string,
    editLink: string,
    id: string,
    image: string,
    isDataLoaded: boolean,
    what: string,
    displayFields: Array<{
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
              private professorService: ProfessorService,
              private courseService: CourseService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/courses/edit';
    this.viewComponentData.what = 'course';
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
    return this.courseService.getParticipant(id)
      .toPromise()
      .then((course: Course) => {
        this.viewComponentData.title = course.name;
        this.viewComponentData.displayFields = [
          {name: 'startDate', value: this.datePipe.transform(course.startDate)},
          {name: 'credits', value: course.credits.toString()},
          {name: 'professor', value: course.professor.firstName + ' ' + course.professor.lastName, routerLink: ['/professors/view', course.professor.professorId]}
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
