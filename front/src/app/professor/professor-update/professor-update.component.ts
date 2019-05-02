import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Professor} from '../../org.ogma.participant';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {Title} from '@angular/platform-browser';
import {ProfessorService} from '../professor.service';

@Component({
  selector: 'app-professor-update',
  templateUrl: './professor-update.component.html',
  styleUrls: ['./professor-update.component.css']
})
export class ProfessorUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private id: string;
  private professor: Professor;

  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private professorService: ProfessorService,
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
          firstName: new FormControl(this.professor.firstName),
          lastName: new FormControl(this.professor.lastName),
          birthDate: new FormControl(this.professor.birthDate),
          phone: new FormControl(this.professor.phone),
          email: new FormControl(this.professor.email),
          address1: new FormControl(this.professor.address.address1),
          address2: new FormControl(this.professor.address.address2),
          state: new FormControl(this.professor.address.state),
          city: new FormControl(this.professor.address.city),
          countryCode: new FormControl(this.professor.address.countryCode),
          zip: new FormControl(this.professor.address.zip)
        };
        this.updateForm = this.fb.group(this.formData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.professorService.getParticipant(id)
      .toPromise()
      .then((result: Professor) => {
        this.professor = result;
        this.photo = this.professor.photo;
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
      $class: 'org.ogma.participant.transaction.UpdateProfessor',
      professor: 'resource:org.ogma.participant.Professor#' + this.id,
      firstName: this.formData.firstName.value,
      lastName: this.formData.lastName.value,
      photo: this.photo,
      birthDate: this.formData.birthDate.value,
      phone: this.formData.phone.value,
      email: this.formData.email.value,
      address1: this.formData.address1.value,
      address2: this.formData.address2.value,
      state: this.formData.state.value,
      city: this.formData.city.value,
      countryCode: this.formData.countryCode.value,
      zip: this.formData.zip.value
    };

    this.showLoader = true;
    return this.professorService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Professor updated successfully!', 'Close', {
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
        subject: 'this professor'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.professorService.deleteParticipant(this.professor.professorId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/professors']);
              this.snackBar.open('Professor deleted successfully!', 'Close', {
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
