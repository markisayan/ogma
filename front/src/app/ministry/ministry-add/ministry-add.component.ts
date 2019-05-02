import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MinistryService} from '../ministry.service';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ministry-add',
  templateUrl: './ministry-add.component.html',
  styleUrls: ['./ministry-add.component.css']
})
export class MinistryAddComponent implements OnInit {

  private Transaction;
  private objectKeys = Object.keys;
  private ministryFormData;
  private logo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  constructor(public snackBar: MatSnackBar,
              private ministryService: MinistryService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.ministryFormData = {
      name: new FormControl(null),
      openingDate: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null),
      websiteUrl: new FormControl(null),
      headFirstName: new FormControl(null),
      headLastName: new FormControl(null),
      managerFirstName: new FormControl(null),
      managerLastName: new FormControl(null),
      address1: new FormControl(null),
      address2: new FormControl(null),
      state: new FormControl(null),
      city: new FormControl(null),
      countryCode: new FormControl('AFG'),
      zip: new FormControl(null)
    };

    this.signupForm = fb.group(this.ministryFormData);
  }

  ngOnInit() {
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
      $class: 'org.ogma.participant.transaction.CreateMinistry',
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
    return this.ministryService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Ministry created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/ministries']);
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
