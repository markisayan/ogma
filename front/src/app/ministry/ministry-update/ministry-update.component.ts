import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Ministry} from '../../org.ogma.participant';
import {MinistryService} from '../ministry.service';
import {GlobalSettingsService} from '../../global-settings.service';

@Component({
  selector: 'app-ministry-update',
  templateUrl: './ministry-update.component.html',
  styleUrls: ['./ministry-update.component.css']
})
export class MinistryUpdateComponent implements OnInit {
  private objectKeys = Object.keys;
  private ministryFormData;
  private updateForm: FormGroup;
  private logo: string | ArrayBuffer;
  private ministry: Ministry;
  private isDataLoaded = false;
  private showLoader = false;
  private id: string;
  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ministryService: MinistryService,
    private globalSettings: GlobalSettingsService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.ministryFormData = {
          name: new FormControl(this.ministry.name),
          openingDate: new FormControl(this.ministry.openingDate),
          phone: new FormControl(this.ministry.phone),
          email: new FormControl(this.ministry.email),
          websiteUrl: new FormControl(this.ministry.websiteUrl),
          headFirstName: new FormControl(this.ministry.headFirstName),
          headLastName: new FormControl(this.ministry.headLastName),
          managerFirstName: new FormControl(this.ministry.managerFirstName),
          managerLastName: new FormControl(this.ministry.managerLastName),
          address1: new FormControl(this.ministry.address.address1),
          address2: new FormControl(this.ministry.address.address2),
          state: new FormControl(this.ministry.address.state),
          city: new FormControl(this.ministry.address.city),
          countryCode: new FormControl(this.ministry.address.countryCode),
          zip: new FormControl(this.ministry.address.zip)
        };
        this.updateForm = this.fb.group(this.ministryFormData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.ministryService.getParticipant(id)
      .toPromise()
      .then((result: Ministry) => {
        this.ministry = result;
        this.logo = this.ministry.logo;
      })
      .catch(error => this.handleError(error));
  }

  onSubmit(form: any): Promise<any> {

    const Transaction = {
      $class: 'org.ogma.participant.transaction.UpdateMinistry',
      ministry: 'resource:org.ogma.participant.Ministry#' + this.id,
      name: this.ministryFormData.name.value,
      logo: this.logo,
      openingDate: this.ministryFormData.openingDate.value,
      phone: this.ministryFormData.phone.value,
      email: this.ministryFormData.email.value,
      websiteUrl: this.ministryFormData.websiteUrl.value,
      headFirstName: this.ministryFormData.headFirstName.value,
      headLastName: this.ministryFormData.headLastName.value,
      managerFirstName: this.ministryFormData.managerFirstName.value,
      managerLastName: this.ministryFormData.managerLastName.value,
      address1: this.ministryFormData.address1.value,
      address2: this.ministryFormData.address2.value,
      state: this.ministryFormData.state.value,
      city: this.ministryFormData.city.value,
      countryCode: this.ministryFormData.countryCode.value,
      zip: this.ministryFormData.zip.value
    };

    this.showLoader = true;
    return this.ministryService.updateParticipant(Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Ministry updated successfully!', 'Close', {
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
        subject: 'this ministry'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.ministryService.deleteParticipant(this.ministry.ministryId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/ministries']);
              this.snackBar.open('Ministry deleted successfully!', 'Close', {
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
