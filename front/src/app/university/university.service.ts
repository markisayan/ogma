import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {University} from '../org.ogma.participant';

// Can be injected into a constructor
@Injectable()
export class UniversityService {

  constructor(private dataService: DataService<University>) {
  }

  public getAll() {
    return this.dataService.getAll('University');
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('University', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateUniversity', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateUniversity', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('University', id);
  }

}
