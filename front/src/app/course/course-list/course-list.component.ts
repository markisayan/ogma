import {Component, OnInit} from '@angular/core';
import {Department, Professor, University} from '../../org.ogma.participant';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {ProfessorService} from '../../professor/professor.service';
import {Course} from '../../org.ogma.academic';
import {CourseService} from '../course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  private isDataLoaded = false;
  private professorIdToName = {};
  private listComponentData: Array<{
    title: string,
    subtitle: string,
    id: string
  }>;

  constructor(public professorService: ProfessorService,
              public courseService: CourseService,
              public snackBar: MatSnackBar,
              public globalSettings: GlobalSettingsService,
              private countryPipe: CountryPipe) {
  }

  ngOnInit() {
    this.loadProfessors()
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
    return this.courseService.getAll()
      .toPromise()
      .then((result: Course[]) => {
        this.listComponentData = result.map(course => {
          return {
            title: course.name,
            subtitle: this.professorIdToName[course.professor.professorId],
            id: course.courseId
          };
        });
      });
  }

  loadProfessors(): Promise<any> {
    const tempList = [];
    return this.professorService.getAll()
      .toPromise()
      .then((result: Professor[]) => {
        result.forEach(professor => {
          this.professorIdToName[professor.professorId] = professor.firstName + ' ' + professor.lastName;
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
