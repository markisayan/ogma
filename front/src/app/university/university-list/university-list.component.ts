import { Component, OnInit } from '@angular/core';
import {UniversityService} from '../university.service';
import {University} from '../../org.ogma.participant';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css']
})
export class UniversityListComponent implements OnInit {

  private isDataLoaded = false;
  private listComponentData: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor(
    public universityService: UniversityService,
    public snackBar: MatSnackBar,
    public globalSettings: GlobalSettingsService,
    private countryPipe: CountryPipe) { }

  ngOnInit() {
    this.loadAll();
  }


  loadAll(): Promise<any> {
    const tempList = [];
    return this.universityService.getAll()
      .toPromise()
      .then((result: University[]) => {
        this.listComponentData = result.map(university => ({
          image: university.logo,
          title: university.name,
          subtitle: university.ministry.name + ' (' + this.countryPipe.transform(university.address.countryCode) + ')',
          id: university.universityId
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
