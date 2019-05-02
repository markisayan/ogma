import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {Title} from '@angular/platform-browser';
import {Student} from '../../org.ogma.academic';
import {StudentService} from '../student.service';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.css']
})
export class StudentUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private isDataLoaded = false;
  private showLoader = false;
  private id: string;
  private student: Student;

  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private studentService: StudentService,
    private globalSettings: GlobalSettingsService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.formData = {
          firstName: new FormControl(this.student.firstName),
          lastName: new FormControl(this.student.lastName),
          enrollmentDate: new FormControl(this.student.enrollmentDate),
          birthDate: new FormControl(this.student.birthDate),
          phone: new FormControl(this.student.phone),
          email: new FormControl(this.student.email),
          group: new FormControl(this.student.group),
          address1: new FormControl(this.student.address.address1),
          address2: new FormControl(this.student.address.address2),
          state: new FormControl(this.student.address.state),
          city: new FormControl(this.student.address.city),
          countryCode: new FormControl(this.student.address.countryCode),
          zip: new FormControl(this.student.address.zip)
        };
        this.updateForm = this.fb.group(this.formData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.studentService.getParticipant(id)
      .toPromise()
      .then((result: Student) => {
        this.student = result;
        this.photo = this.student.photo;
      })
      .catch(error => this.handleError(error));
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
      $class: 'org.ogma.academic.transaction.UpdateStudent',
      student: 'resource:org.ogma.academic.Student#' + this.id,
      firstName: this.formData.firstName.value,
      lastName: this.formData.lastName.value,
      photo: this.photo,
      enrollmentDate: this.formData.enrollmentDate.value,
      birthDate: this.formData.birthDate.value,
      phone: this.formData.phone.value,
      email: this.formData.email.value,
      group: this.formData.group.value,
      address1: this.formData.address1.value,
      address2: this.formData.address2.value,
      state: this.formData.state.value,
      city: this.formData.city.value,
      countryCode: this.formData.countryCode.value,
      zip: this.formData.zip.value
    };

    this.showLoader = true;
    return this.studentService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Student updated successfully!', 'Close', {
          duration: 2000
        });
      })
      .catch(error => this.handleError(error));
  }

  onDelete() {
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      data: {
        action: 'delete',
        subject: 'this student'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.studentService.deleteParticipant(this.student.studentId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/students']);
              this.snackBar.open('Student updated successfully!', 'Close', {
                duration: 2000
              });
            })
            .catch(error => this.handleError(error));
        }
      });
  }

  onImageUpload() {
    const dialogConfig = {
      autoFocus: true,
      data: { image: this.photo }
    };

    const dialogRef = this.dialog.open(ImageUploadComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'noimg') {
          this.photo = '';
        } else if (result) {
          this.photo = result;
        }
      });
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
