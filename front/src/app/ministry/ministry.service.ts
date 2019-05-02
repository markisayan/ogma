import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import {Ministry} from '../org.ogma.participant';

// Can be injected into a constructor
@Injectable()
export class MinistryService {
  constructor(private dataService: DataService<Ministry>) {
  }

  public getAll() {
    return this.dataService.getAll('Ministry');
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Ministry', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateMinistry', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateMinistry', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Ministry', id);
  }

}
