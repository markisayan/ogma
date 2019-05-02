import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {Department, Professor} from './org.ogma.participant';
import {Address} from './org.ogma.concept';

// export namespace org.ogma.academic{
export class Student extends Asset {
  studentId: string;
  birthDate: Date;
  enrollmentDate: Date;
  photo: string;
  group: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: Address;
  department: Department;
}

export class Course extends Asset {
  courseId: string;
  name: string;
  startDate: Date;
  credits: number;
  professor: Professor;
}

export class Assignment extends Asset {
  assignmentId: string;
  name: string;
  gradeRequired: string;
  course: Course;
}

export class StudentCourse extends Asset {
  studentCourseId: string;
  finalGrade: string;
  student: Student;
  course: Course;
}

export class StudentAssignment extends Asset {
  studentAssignmentId: string;
  grade: string;
  passed: boolean;
  additionalFiles: string;
  student: Student;
  assignment: Assignment;
}

// }
