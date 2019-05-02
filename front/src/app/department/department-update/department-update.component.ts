import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DepartmentService} from '../department.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Department} from '../../org.ogma.participant';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-department-update',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.css']
})
export class DepartmentUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private departmentFormData;
  private logo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private isDataLoaded = false;
  private showLoader = false;
  private id: string;
  private department: Department;

  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private departmentService: DepartmentService,
    private globalSettings: GlobalSettingsService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.departmentFormData = {
          name: new FormControl(this.department.name),
          openingDate: new FormControl(this.department.openingDate),
          phone: new FormControl(this.department.phone),
          email: new FormControl(this.department.email),
          websiteUrl: new FormControl(this.department.websiteUrl),
          headFirstName: new FormControl(this.department.headFirstName),
          headLastName: new FormControl(this.department.headLastName),
          managerFirstName: new FormControl(this.department.managerFirstName),
          managerLastName: new FormControl(this.department.managerLastName),
          address1: new FormControl(this.department.address.address1),
          address2: new FormControl(this.department.address.address2),
          state: new FormControl(this.department.address.state),
          city: new FormControl(this.department.address.city),
          countryCode: new FormControl(this.department.address.countryCode),
          zip: new FormControl(this.department.address.zip)
        };
        this.updateForm = this.fb.group(this.departmentFormData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.departmentService.getParticipant(id)
      .toPromise()
      .then((result: Department) => {
        this.department = result;
        this.logo = this.department.logo;
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
      $class: 'org.ogma.participant.transaction.UpdateDepartment',
      department: 'resource:org.ogma.participant.Department#' + this.id,
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
    return this.departmentService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Department updated successfully!', 'Close', {
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
        subject: 'this department'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.departmentService.deleteParticipant(this.department.departmentId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/departments']);
              this.snackBar.open('Department deleted successfully!', 'Close', {
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
