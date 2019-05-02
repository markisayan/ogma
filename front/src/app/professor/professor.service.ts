import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {Department} from '../org.ogma.participant';

// Can be injected into a constructor
@Injectable()
export class ProfessorService {
  constructor(private dataService: DataService<Department>) {
  }

  public getAll() {
    return this.dataService.getAll('Professor');
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Professor', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateProfessor', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateProfessor', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Professor', id);
  }

}
