import {Component, OnInit} from '@angular/core';
import {Ministry, University} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {UniversityService} from '../university.service';
import {GlobalSettingsService} from '../../global-settings.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {CountryPipe} from '../../country.pipe';
import {MinistryService} from '../../ministry/ministry.service';

@Component({
  selector: 'app-university-view',
  templateUrl: './university-view.component.html',
  styleUrls: ['./university-view.component.css']
})
export class UniversityViewComponent implements OnInit {
  private viewComponentData: {
    title: string,
    editLink: string,
    id: string,
    image: string,
    isDataLoaded: boolean,
    what: string,
    displayFields: Array<{
      name: string,
      value: string,
      link?: string,
      routerLink?: string | Array<string>
    }>
  };
  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private universityService: UniversityService,
              private ministryService: MinistryService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/universities/edit';
    this.viewComponentData.what = 'university';
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
    return this.universityService.getParticipant(id)
      .toPromise()
      .then((university: University) => {
        this.viewComponentData.image = university.logo;
        this.viewComponentData.title = university.name;
        this.viewComponentData.displayFields = [
          {name: 'head', value: university.headFirstName + ' ' + university.headLastName},
          {name: 'opening date', value: this.datePipe.transform(university.openingDate)},
          {name: 'email', value: university.email, link: 'mailto:' + university.email},
          {name: 'website', value: university.websiteUrl, link: university.websiteUrl},
          {name: 'phone', value: university.phone},
          {
            name: 'address',
            value: [university.address.address1, university.address.address2, university.address.city, university.address.state, this.countryPipe.transform(university.address.countryCode)].join(', ')
          },
          {name: 'ministry', value: university.ministry.name, routerLink: ['/ministries/view', university.ministry.ministryId]},
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
