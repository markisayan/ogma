import {Component, OnInit} from '@angular/core';
import {MinistryService} from '../ministry.service';
import {Ministry} from '../../org.ogma.participant';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {ListComponent} from '../../pages/list/list.component';

@Component({
  selector: 'app-ministry-list',
  templateUrl: './ministry-list.component.html',
  styleUrls: ['./ministry-list.component.css']
})
export class MinistryListComponent implements OnInit {
  private isDataLoaded = false;
  private listComponentData: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;

  constructor(public ministryService: MinistryService,
              public snackBar: MatSnackBar,
              public globalSettings: GlobalSettingsService,
              private countryPipe: CountryPipe) {
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.ministryService.getAll()
      .toPromise()
      .then((result: Ministry[]) => {
        this.listComponentData = result.map(ministry => ({
          image: ministry.logo,
          title: ministry.name,
          subtitle: this.countryPipe.transform(ministry.address.countryCode),
          id: ministry.ministryId
        }));
        this.isDataLoaded = true;
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
