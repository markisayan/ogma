import { Component, OnInit } from '@angular/core';
import {Department, Professor, University} from '../../org.ogma.participant';
import {MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {CountryPipe} from '../../country.pipe';
import {DepartmentService} from '../department.service';
import {ProfessorService} from '../professor.service';

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.css']
})
export class ProfessorListComponent implements OnInit {
  private isDataLoaded = false;
  private listComponentData: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor(
    public professorService: ProfessorService,
    public snackBar: MatSnackBar,
    public globalSettings: GlobalSettingsService,
    private countryPipe: CountryPipe) { }

  ngOnInit() {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.professorService.getAll()
      .toPromise()
      .then((result: Professor[]) => {
        this.listComponentData = result.map(professor => ({
          image: professor.photo,
          title: professor.firstName + ' ' + professor.lastName,
          subtitle: professor.university.name,
          id: professor.professorId
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
