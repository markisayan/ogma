import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {Course} from '../org.ogma.academic';

// Can be injected into a constructor
@Injectable()
export class CourseService {

  constructor(private dataService: DataService<Course>) {
  }

  public getAll(filter?: object) {
    return this.dataService.getAll('Course', filter);
  }

  public getParticipant(id: any) {
    return this.dataService.getSingle('Course', id);
  }

  public addParticipant(itemToAdd: any) {
    return this.dataService.add('CreateCourse', itemToAdd);
  }

  public updateParticipant(itemToUpdate: any) {
    return this.dataService.add('UpdateCourse', itemToUpdate);
  }

  public deleteParticipant(id: any) {
    return this.dataService.delete('Course', id);
  }

  public addStudentCourse(itemToAdd: any) {
    return this.dataService.add('CreateStudentCourse', itemToAdd);
  }

  public updateStudentCourse(itemToAdd: any) {
    return this.dataService.add('UpdateStudentCourse', itemToAdd);
  }

  public deleteStudentCourse(id: any) {
    return this.dataService.delete('StudentCourse', id);
  }

  public getAllStudentCourses(filter?: object) {
    return this.dataService.getAll('StudentCourse', filter);
  }

  public getSingleStudentCourse(id: any) {
    return this.dataService.getSingle('StudentCourse', id);
  }
}
