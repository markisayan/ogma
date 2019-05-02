import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UniversityService} from '../../university/university.service';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {Ministry, Professor, University} from '../../org.ogma.participant';
import {Course} from '../../org.ogma.academic';
import {ProfessorService} from '../../professor/professor.service';
import {CourseService} from '../course.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.css']
})
export class CourseAddComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allProfessors: Array<Professor>;
  constructor(public snackBar: MatSnackBar,
              private professorService: ProfessorService,
              private courseService: CourseService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.formData = {
      professorId: new FormControl(null),
      name: new FormControl(null),
      startDate: new FormControl(null),
      credits: new FormControl(null),
    };

    this.signupForm = fb.group(this.formData);
  }

  ngOnInit() {
    this.loadProfessors()
      .then(() => {
        this.isDataLoaded = true;
      });
  }

  handleFileInput(files: FileList) {
    const fileToUpload = files.item(0);
    if (!fileToUpload) {
      return;
    }
    const myReader = new FileReader();

    myReader.onloadend = () => {
      this.photo = myReader.result;
    };
    myReader.readAsDataURL(fileToUpload);
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.academic.transaction.CreateCourse',
      professor: 'resource:org.ogma.participant.Professor#' + this.formData.professorId.value,
      name: this.formData.name.value,
      startDate: this.formData.startDate.value,
      credits: this.formData.credits.value,
    };

    this.showLoader = true;
    return this.courseService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Course created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/courses']);
      })
      .catch(error => this.handleError(error));
  }

  loadProfessors(): Promise<any> {
    const tempList = [];
    return this.professorService.getAll()
      .toPromise()
      .then((result: Professor[]) => {
        result.forEach(participant => {
          tempList.push(participant);
        });
        this.allProfessors = tempList;
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
