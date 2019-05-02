import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UniversityService} from '../../university/university.service';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {Ministry, University} from '../../org.ogma.participant';
import {ProfessorService} from '../professor.service';

@Component({
  selector: 'app-professor-add',
  templateUrl: './professor-add.component.html',
  styleUrls: ['./professor-add.component.css']
})
export class ProfessorAddComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allUniversities: Array<University>;
  constructor(public snackBar: MatSnackBar,
              private professorService: ProfessorService,
              private universityService: UniversityService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.formData = {
      universityId: new FormControl(null),
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      birthDate: new FormControl(null),
      phone: new FormControl(null),
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
      $class: 'org.ogma.participant.transaction.CreateProfessor',
      university: 'resource:org.ogma.participant.University#' + this.formData.universityId.value,
      firstName: this.formData.firstName.value,
      lastName: this.formData.lastName.value,
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
    return this.professorService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Professor created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/professors']);
      })
      .catch(error => this.handleError(error));
  }

  loadUniversities(): Promise<any> {
    const tempList = [];
    return this.universityService.getAll()
      .toPromise()
      .then((result: University[]) => {
        result.forEach(participant => {
          tempList.push(participant);
        });
        this.allUniversities = tempList;
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
