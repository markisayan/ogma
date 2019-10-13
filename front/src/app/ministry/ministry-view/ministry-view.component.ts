import {Component, OnInit} from '@angular/core';
import {Ministry} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {MinistryService} from '../ministry.service';
import {GlobalSettingsService} from '../../global-settings.service';
import {DatePipe} from '@angular/common';
import {CountryPipe} from '../../country.pipe';

@Component({
  selector: 'app-ministry-view',
  templateUrl: './ministry-view.component.html',
  styleUrls: ['./ministry-view.component.css']
})
export class MinistryViewComponent implements OnInit {
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
              private ministryService: MinistryService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
    this.viewComponentData = {};
    this.viewComponentData.editLink = '/ministries/edit';
    this.viewComponentData.what = 'ministry';
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
    return this.ministryService.getParticipant(id)
      .toPromise()
      .then((ministry: Ministry) => {
        this.viewComponentData.image = ministry.logo;
        this.viewComponentData.title = ministry.name;
        this.viewComponentData.displayFields = [
          {name: 'opening date', value: this.datePipe.transform(ministry.openingDate)},
          {name: 'head', value: ministry.headFirstName + ' ' + ministry.headLastName},
          {name: 'email', value: ministry.email, link: 'mailto:' + ministry.email},
          {name: 'website', value: ministry.websiteUrl, link: ministry.websiteUrl},
          {name: 'phone', value: ministry.phone},
          {
            name: 'address',
            value: [ministry.address.address1, ministry.address.address2, ministry.address.city, ministry.address.state, this.countryPipe.transform(ministry.address.countryCode)].join(', ')
          }
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
