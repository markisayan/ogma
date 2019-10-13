import {Component, OnInit} from '@angular/core';
import {Professor, University} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {GlobalSettingsService} from '../../global-settings.service';
import {DatePipe} from '@angular/common';
import {CountryPipe} from '../../country.pipe';
import {UniversityService} from '../../university/university.service';
import {ProfessorService} from '../professor.service';

@Component({
  selector: 'app-professor-view',
  templateUrl: './professor-view.component.html',
  styleUrls: ['./professor-view.component.css']
})
export class ProfessorViewComponent implements OnInit {
  private viewComponentData: {
    title?: string,
    editLink?: string,
    id?: string,
    image?: string,
    isDataLoaded?: boolean,
    what?: string,
    displayFields?: Array<{
      name: string,
      value: string,
      link?: string,
      routerLink?: Array<string>
    }>
  };
  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private universityService: UniversityService,
              private professorService: ProfessorService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/professors/edit';
    this.viewComponentData.what = 'professor';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.viewComponentData.id = id;
    this.load(id)
      .then(() => {
        this.viewComponentData.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.professorService.getParticipant(id)
      .toPromise()
      .then((professor: Professor) => {
        this.viewComponentData.image = professor.photo;
        this.viewComponentData.title = professor.firstName + ' ' + professor.lastName;
        this.viewComponentData.displayFields = [
          {name: 'birthDate', value: this.datePipe.transform(professor.birthDate)},
          {name: 'email', value: professor.email, link: 'mailto:' + professor.email},
          {name: 'phone', value: professor.phone},
          {
            name: 'address',
            value: [professor.address.address1, professor.address.address2, professor.address.city, professor.address.state, this.countryPipe.transform(professor.address.countryCode)].join(', ')
          },
          {name: 'university', value: professor.university.name, routerLink: ['/universities/view', professor.university.universityId]}
        ];
      })

      .catch(error => this.handleError(error));
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
