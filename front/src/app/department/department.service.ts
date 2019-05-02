import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {Department} from '../org.ogma.participant';

// Can be injected into a constructor
@Injectable()
export class DepartmentService {
  constructor(private dataService: DataService<Department>) {
  }

  public getAll() {
    return this.dataService.getAll('Department');
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Department', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateDepartment', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateDepartment', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Department', id);
  }

}
