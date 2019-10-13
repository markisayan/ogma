import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {ImageUploadComponent} from '../../dialogs/image-upload/image-upload.component';
import {Title} from '@angular/platform-browser';
import {Course, Student, StudentAssignment, StudentCourse} from '../../org.ogma.academic';
import {CourseService} from '../course.service';
import {StudentService} from '../../student/student.service';

interface StudentNode {
  name: string;
  id: string;
  studentCourse?: StudentCourse;
}

interface DepartmentsTreeNode {
  name: string;
  id: string;
  students?: StudentNode[];
}

@Component({
  selector: 'app-course-update',
  templateUrl: './course-update.component.html',
  styleUrls: ['./course-update.component.css']
})
export class CourseUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private isDataLoaded = false;
  private showLoader = false;
  private id: string;
  private course: Course;
  private departmentsTree: Array<DepartmentsTreeNode> = [];

  constructor(
    private snackBar: MatSnackBar,
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private courseService: CourseService,
    private globalSettings: GlobalSettingsService,
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.formData = {
          name: new FormControl(this.course.name),
          startDate: new FormControl(this.course.startDate),
          credits: new FormControl(this.course.credits)
        };
        this.updateForm = this.fb.group(this.formData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.courseService.getParticipant(id)
      .toPromise()
      .then((result: Course) => {
        this.course = result;

        return Promise.all([
          this.studentService.getAll().toPromise(),
          this.courseService.getAllStudentCourses({
            course: 'resource:org.ogma.academic.Course#' + this.course.courseId
          }).toPromise()
        ]);
      })
      .then(([students, studentCourses]) => {
        (students as Array<Student>).forEach(student => {
          if (!this.departmentsTree.find(department => department.id === student.department.departmentId)) {
            this.departmentsTree.push({
              name: student.department.name + ' (' + student.department.university.name + ')',
              id: student.department.departmentId
            });
          }
          const deptIndex = this.departmentsTree.findIndex(department => department.id === student.department.departmentId);
          if (!this.departmentsTree[deptIndex].students) {
            this.departmentsTree[deptIndex].students = [];
          }
          if (!this.departmentsTree[deptIndex].students.find(st => st.id === student.studentId)) {
            this.departmentsTree[deptIndex].students.push({
              name: student.firstName + ' ' + student.lastName,
              id: student.studentId,
              studentCourse: (studentCourses as Array<StudentCourse>).find(s => s.student.studentId === student.studentId)
            });
          }
        });
      })
      .catch(error => this.handleError(error));
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.academic.transaction.UpdateCourse',
      course: 'resource:org.ogma.academic.Course#' + this.id,
      name: this.formData.name.value,
      credits: this.formData.credits.value,
      startDate: this.formData.startDate.value
    };

    this.showLoader = true;
    return this.courseService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Course updated successfully!', 'Close', {
          duration: 2000
        });
      })
      .catch(error => this.handleError(error));
  }

  onDelete() {
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      data: {
        action: 'delete',
        subject: 'this course'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.courseService.deleteParticipant(this.course.courseId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/courses']);
              this.snackBar.open('Course deleted successfully!', 'Close', {
                duration: 2000
              });
            })
            .catch(error => this.handleError(error));
        }
      });
  }

  onImageUpload() {
    const dialogConfig = {
      autoFocus: true,
      data: { image: this.photo }
    };

    const dialogRef = this.dialog.open(ImageUploadComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'noimg') {
          this.photo = '';
        } else if (result) {
          this.photo = result;
        }
      });
  }

  commitStudentCourse(student: StudentNode, finalGrade, studentCourse?) {
    this.showLoader = true;
    if (studentCourse) {
      // update
      this.courseService.updateStudentCourse({
        finalGrade,
        studentCourse: 'org.ogma.academic.StudentCourse#' + studentCourse.studentCourseId
      })
        .toPromise()
        .then(() => {
          this.showLoader = false;
          this.snackBar.open('Successfully updated student course result!', 'Close', {
            duration: 2000
          });
        });
    } else {
      // create
      const itemToAdd: {student: string, course: string, finalGrade?: number} = {
        student: 'org.ogma.academic.Student#' + student.id,
        course: 'org.ogma.academic.Course#' + this.course.courseId
      };

      if (finalGrade) {
        itemToAdd.finalGrade = finalGrade;
      }

      this.courseService.addStudentCourse(itemToAdd)
        .toPromise()
        .then(() => {
          return this.courseService.getAllStudentCourses({
            and: [
              {student: 'resource:org.ogma.academic.Student#' + student.id},
              {course: 'resource:org.ogma.academic.Course#' + this.course.courseId}
            ]
          }).toPromise();
        })
        .then((result: StudentCourse[]) => {
          student.studentCourse = result[0];
          this.showLoader = false;
          this.snackBar.open('Successfully added student to course!', 'Close', {
            duration: 2000
          });
        })
        .catch(error => this.handleError(error));
    }
  }

  deleteStudentCourse(student: StudentNode) {
    this.showLoader = true;
    this.courseService.deleteStudentCourse(student.studentCourse.studentCourseId)
      .toPromise()
      .then(() => {
        delete student.studentCourse;
        this.showLoader = false;

        this.snackBar.open('Successfully removed student from course!', 'Close', {
          duration: 2000
        });
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.showLoader = false;
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
