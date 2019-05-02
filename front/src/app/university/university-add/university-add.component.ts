import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MinistryService} from '../../ministry/ministry.service';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {UniversityService} from '../university.service';
import {Ministry} from '../../org.ogma.participant';

@Component({
  selector: 'app-university-add',
  templateUrl: './university-add.component.html',
  styleUrls: ['./university-add.component.css']
})
export class UniversityAddComponent implements OnInit {

  private Transaction;
  private objectKeys = Object.keys;
  private universityFormData;
  private logo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allMinistries: Ministry[];
  constructor(public snackBar: MatSnackBar,
              private ministryService: MinistryService,
              private universityService: UniversityService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.universityFormData = {
      name: new FormControl(null),
      openingDate: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null),
      websiteUrl: new FormControl(null),
      headFirstName: new FormControl(null),
      headLastName: new FormControl(null),
      managerFirstName: new FormControl(null),
      managerLastName: new FormControl(null),
      ministryId: new FormControl(null),
      address1: new FormControl(null),
      address2: new FormControl(null),
      state: new FormControl(null),
      city: new FormControl(null),
      countryCode: new FormControl('AFG'),
      zip: new FormControl(null)
    };

    this.signupForm = fb.group(this.universityFormData);
  }

  ngOnInit() {
    this.loadMinistries();
  }

  loadMinistries(): Promise<any> {
    const tempList = [];
    return this.ministryService.getAll()
      .toPromise()
      .then((result: Ministry[]) => {
        result.forEach(participant => {
          tempList.push(participant);
        });
        this.allMinistries = tempList;
        this.isDataLoaded = true;
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
      $class: 'org.ogma.participant.transaction.CreateUniversity',
      ministry: 'resource:org.ogma.participant.Ministry#' + this.universityFormData.ministryId.value,
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
    return this.universityService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('University created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/universities']);
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
