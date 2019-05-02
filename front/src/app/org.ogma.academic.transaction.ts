import {Transaction} from './org.hyperledger.composer.system';
import {Assignment, Course, Student, StudentAssignment, StudentCourse} from './org.ogma.academic';
import {Department, Professor} from './org.ogma.participant';

// export namespace org.ogma.academic.transaction{
export class Transfer extends Transaction {
  student: Student;
  newDepartment: Department;
}

export class CreateStudent extends Transaction {
  department: Department;
  firstName: string;
  lastName: string;
  birthDate: Date;
  enrollmentDate: Date;
  photo: string;
  group: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class UpdateStudent extends Transaction {
  student: Student;
  firstName: string;
  lastName: string;
  birthDate: Date;
  enrollmentDate: Date;
  photo: string;
  group: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  countryCode: string;
  zip: string;
}

export class CreateCourse extends Transaction {
  name: string;
  startDate: Date;
  credits: number;
  professor: Professor;
}

export class UpdateCourse extends Transaction {
  name: string;
  startDate: Date;
  credits: number;
  course: Course;
}

export class CreateAssignment extends Transaction {
  name: string;
  gradeRequired: string;
  course: Course;
}

export class UpdateAssignment extends Transaction {
  name: string;
  gradeRequired: string;
  assignment: Assignment;
}

export class CreateStudentCourse extends Transaction {
  student: Student;
  course: Course;

}

export class UpdateStudentCourse extends Transaction {
  finalGrade: string;
  studentCourse: StudentCourse;
}

export class CreateStudentAssignment extends Transaction {
  grade: string;
  passed: boolean;
  additionalFiles: string;
  student: Student;
  assignment: Assignment;
}

export class UpdateStudentAssignment extends Transaction {
  grade: string;
  passed: boolean;
  additionalFiles: string;
  studentAssignment: StudentAssignment;
}

// }
