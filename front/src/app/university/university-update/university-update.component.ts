import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {University} from '../../org.ogma.participant';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {Title} from '@angular/platform-browser';
import {UniversityService} from '../university.service';

@Component({
  selector: 'app-university-update',
  templateUrl: './university-update.component.html',
  styleUrls: ['./university-update.component.css']
})
export class UniversityUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private universityFormData;
  private logo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private id: string;
  private university: University;

  constructor(
      private snackBar: MatSnackBar,
      private titleService: Title,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private universityService: UniversityService,
      private globalSettings: GlobalSettingsService,
      private fb: FormBuilder,
      private router: Router
    ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.universityFormData = {
          name: new FormControl(this.university.name),
          openingDate: new FormControl(this.university.openingDate),
          phone: new FormControl(this.university.phone),
          email: new FormControl(this.university.email),
          websiteUrl: new FormControl(this.university.websiteUrl),
          headFirstName: new FormControl(this.university.headFirstName),
          headLastName: new FormControl(this.university.headLastName),
          managerFirstName: new FormControl(this.university.managerFirstName),
          managerLastName: new FormControl(this.university.managerLastName),
          address1: new FormControl(this.university.address.address1),
          address2: new FormControl(this.university.address.address2),
          state: new FormControl(this.university.address.state),
          city: new FormControl(this.university.address.city),
          countryCode: new FormControl(this.university.address.countryCode),
          zip: new FormControl(this.university.address.zip)
        };
        this.updateForm = this.fb.group(this.universityFormData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.universityService.getParticipant(id)
      .toPromise()
      .then((result: University) => {
        this.university = result;
        this.logo = this.university.logo;
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
      this.logo = myReader.result;
    };
    myReader.readAsDataURL(fileToUpload);
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.participant.transaction.UpdateUniversity',
      university: 'resource:org.ogma.participant.University#' + this.id,
      name: this.universityFormData.name.value,
      logo: this.logo,
      openingDate: this.universityFormData.openingDate.value,
      phone: this.universityFormData.phone.value,
      email: this.universityFormData.email.value,
      websiteUrl: this.universityFormData.websiteUrl.value,
      headFirstName: this.universityFormData.headFirstName.value,
      headLastName: this.universityFormData.headLastName.value,
      managerFirstName: this.universityFormData.managerFirstName.value,
      managerLastName: this.universityFormData.managerLastName.value,
      address1: this.universityFormData.address1.value,
      address2: this.universityFormData.address2.value,
      state: this.universityFormData.state.value,
      city: this.universityFormData.city.value,
      countryCode: this.universityFormData.countryCode.value,
      zip: this.universityFormData.zip.value
    };

    this.showLoader = true;
    return this.universityService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('University updated successfully!', 'Close', {
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
        subject: 'this university'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.universityService.deleteParticipant(this.university.universityId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/universities']);
              this.snackBar.open('University deleted successfully!', 'Close', {
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
      data: { image: this.logo }
    };

    const dialogRef = this.dialog.open(ImageUploadComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'noimg') {
          this.logo = '';
        } else if (result) {
          this.logo = result;
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
