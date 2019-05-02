import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UniversityService} from '../../university/university.service';
import {DepartmentService} from '../department.service';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {Router} from '@angular/router';
import {Ministry, University} from '../../org.ogma.participant';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.css']
})
export class DepartmentAddComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private departmentFormData;
  private logo: string | ArrayBuffer;
  private signupForm: FormGroup;
  private showLoader = false;
  private isDataLoaded = false;
  private allUniversities: Array<University>;
  constructor(public snackBar: MatSnackBar,
              private departmentService: DepartmentService,
              private universityService: UniversityService,
              public globalSettings: GlobalSettingsService,
              public fb: FormBuilder,
              private router: Router) {
    this.departmentFormData = {
      universityId: new FormControl(null),
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

    this.signupForm = fb.group(this.departmentFormData);
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
      this.logo = myReader.result;
    };
    myReader.readAsDataURL(fileToUpload);
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.participant.transaction.CreateDepartment',
      university: 'resource:org.ogma.participant.University#' + this.departmentFormData.universityId.value,
      name: this.departmentFormData.name.value,
      logo: this.logo,
      openingDate: this.departmentFormData.openingDate.value,
      phone: this.departmentFormData.phone.value,
      email: this.departmentFormData.email.value,
      websiteUrl: this.departmentFormData.websiteUrl.value,
      headFirstName: this.departmentFormData.headFirstName.value,
      headLastName: this.departmentFormData.headLastName.value,
      managerFirstName: this.departmentFormData.managerFirstName.value,
      managerLastName: this.departmentFormData.managerLastName.value,
      address1: this.departmentFormData.address1.value,
      address2: this.departmentFormData.address2.value,
      state: this.departmentFormData.state.value,
      city: this.departmentFormData.city.value,
      countryCode: this.departmentFormData.countryCode.value,
      zip: this.departmentFormData.zip.value
    };

    this.showLoader = true;
    return this.departmentService.addParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Department created successfully!', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/departments']);
      })
      .catch(error => this.handleError(error));
  }

  loadUniversities(): Promise<any> {
    const tempList = [];
    return this.universityService.getAll()
      .toPromise()
      .then((result: Ministry[]) => {
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
