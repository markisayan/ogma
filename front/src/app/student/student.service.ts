import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {Student} from '../org.ogma.academic';

// Can be injected into a constructor
@Injectable()
export class StudentService {
  constructor(private dataService: DataService<Student>) {
  }

  public getAll(filter?: object) {
    return this.dataService.getAll('Student', filter);
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Student', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateStudent', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateStudent', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Student', id);
  }

}
