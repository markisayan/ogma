import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {Assignment} from '../org.ogma.academic';

// Can be injected into a constructor
@Injectable()
export class AssignmentService {

  constructor(private dataService: DataService<Assignment>) {
  }

  public getAll() {
    return this.dataService.getAll('Assignment');
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Assignment', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateAssignment', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateAssignment', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Assignment', id);
  }

  public addStudentAssignment(itemToAdd: any) {
    return this.dataService.add('CreateStudentAssignment', itemToAdd);
  }

  public updateStudentAssignment(itemToAdd: any) {
    return this.dataService.add('UpdateStudentAssignment', itemToAdd);
  }

  public deleteStudentAssignment(id: any) {
    return this.dataService.delete('StudentAssignment', id);
  }

  public getAllStudentAssignments(filter?: object) {
    return this.dataService.getAll('StudentAssignment', filter);
  }

  public getSingleStudentAssignment(id: any) {
    return this.dataService.getSingle('StudentAssignment', id);
  }

}
