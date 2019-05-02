import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {Department, Ministry, University} from '../../org.ogma.participant';
import {StudentService} from '../student.service';
import {DepartmentService} from '../../department/department.service';
import {UniversityService} from '../../university/university.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css']
})
export class StudentAddComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allDepartments = [];
  private universityIdToName = {};
  constructor(public snackBar: MatSnackBar,
              private studentService: StudentService,
              private departmentService: DepartmentService,
              private universityService: UniversityService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.formData = {
      departmentId: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      birthDate: new FormControl(null),
      enrollmentDate: new FormControl(null),
      phone: new FormControl(null),
      group: new FormControl(null),
      email: new FormControl(null),
      address1: new FormControl(null),
      address2: new FormControl(null),
      state: new FormControl(null),
      city: new FormControl(null),
      countryCode: new FormControl('AFG'),
      zip: new FormControl(null)
    };

    this.signupForm = fb.group(this.formData);
  }

  ngOnInit() {
    this.loadUniversities()
      .then(() => {
        return this.loadDepartments();
      })
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
      $class: 'org.ogma.academic.transaction.CreateStudent',
      department: 'resource:org.ogma.participant.Department#' + this.formData.departmentId.value,
      firstName: this.formData.firstName.value,
      lastName: this.formData.lastName.value,
      photo: this.photo,
      birthDate: this.formData.birthDate.value,
      enrollmentDate: this.formData.enrollmentDate.value,
      phone: this.formData.phone.value,
      group: this.formData.group.value,
      email: this.formData.email.value,
      address1: this.formData.address1.value,
      address2: this.formData.address2.value,
      state: this.formData.state.value,
      city: this.formData.city.value,
      countryCode: this.formData.countryCode.value,
      zip: this.formData.zip.value
    };

    this.showLoader = true;
    return this.studentService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Student created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/students']);
      })
      .catch(error => this.handleError(error));
  }

  loadDepartments(): Promise<any> {
    return this.departmentService.getAll()
      .toPromise()
      .then((result: Department[]) => {
        result.forEach(department => {
          const uni = department.university as any as string;
          department['_displayName'] = department.name + ' (' + this.universityIdToName[department.university.universityId] + ')';
          this.allDepartments.push(department);
        });
      })
      .catch(error => this.handleError(error));
  }

  loadUniversities(): Promise<any> {
    const tempList = [];
    return this.universityService.getAll()
      .toPromise()
      .then((result: University[]) => {
        result.forEach(participant => {
          this.universityIdToName[participant.universityId] = participant.name;
        });
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
