import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {Assignment, Course} from '../../org.ogma.academic';
import {CourseService} from '../../course/course.service';
import {AssignmentService} from '../assignment.service';

@Component({
  selector: 'app-assignment-add',
  templateUrl: './assignment-add.component.html',
  styleUrls: ['./assignment-add.component.css']
})
export class AssignmentAddComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allCourses: Array<Course>;
  constructor(public snackBar: MatSnackBar,
              private courseService: CourseService,
              private assignmentService: AssignmentService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.formData = {
      courseId: new FormControl(null),
      name: new FormControl(null),
      date: new FormControl(null),
      gradeRequired: new FormControl(null),
    };

    this.signupForm = fb.group(this.formData);
  }

  ngOnInit() {
    this.loadAllCourses()
      .then(() => {
        this.isDataLoaded = true;
      });
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.academic.transaction.CreateAssignment',
      course: 'resource:org.ogma.academic.Course#' + this.formData.courseId.value,
      name: this.formData.name.value,
      date: this.formData.date.value,
      gradeRequired: this.formData.gradeRequired.value,
    };

    this.showLoader = true;
    return this.assignmentService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Assignment created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/assignments']);
      })
      .catch(error => this.handleError(error));
  }

  loadAllCourses(): Promise<any> {
    const tempList = [];
    return this.courseService.getAll()
      .toPromise()
      .then((result: Assignment[]) => {
        result.forEach(participant => {
          tempList.push(participant);
        });
        this.allCourses = tempList;
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.showLoader = false;
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
