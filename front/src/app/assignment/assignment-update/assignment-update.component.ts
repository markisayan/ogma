import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {GlobalSettingsService} from '../../global-settings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WarningComponent} from '../../dialogs/warning/warning.component';
import {Title} from '@angular/platform-browser';
import {Assignment, Student, StudentAssignment} from '../../org.ogma.academic';
import {AssignmentService} from '../assignment.service';
import {StudentService} from '../../student/student.service';

interface StudentNode {
  name: string;
  id: string;
  studentAssignment?: StudentAssignment;
}

interface DepartmentsTreeNode {
  name: string;
  id: string;
  students?: StudentNode[];
}


@Component({
  selector: 'app-assignment-update',
  templateUrl: './assignment-update.component.html',
  styleUrls: ['./assignment-update.component.css']
})
export class AssignmentUpdateComponent implements OnInit {
  private Transaction;
  private objectKeys = Object.keys;
  private formData;
  private photo: string | ArrayBuffer;
  private updateForm: FormGroup;
  private isDataLoaded = false;
  private showLoader = false;
  private id: string;
  private assignment: Assignment;
  private departmentsTree: Array<DepartmentsTreeNode> = [];

  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private assignmentService: AssignmentService,
              private globalSettings: GlobalSettingsService,
              private fb: FormBuilder,
              private router: Router,
              private studentService: StudentService) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.load(this.id)
      .then(() => {
        this.formData = {
          name: new FormControl(this.assignment.name),
          gradeRequired: new FormControl(this.assignment.gradeRequired)
        };
        this.updateForm = this.fb.group(this.formData);
        this.isDataLoaded = true;
      });
  }

  load(id): Promise<any> {
    return this.assignmentService.getParticipant(id)
      .toPromise()
      .then((result: Assignment) => {
        this.assignment = result;

        return Promise.all([
          this.studentService.getAll().toPromise(),
          this.assignmentService.getAllStudentAssignments({
            assignment: 'resource:org.ogma.academic.Assignment#' + this.assignment.assignmentId
          }).toPromise()
        ]);
      })
      .then(([students, studentAssignments]) => {
        students.forEach(student => {
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
              studentAssignment: studentAssignments.find(s => s.student.studentId === student.studentId)
            });
          }
        });
      })
      .catch(error => this.handleError(error));
  }

  onSubmit(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.ogma.academic.transaction.UpdateAssignment',
      assignment: 'resource:org.ogma.academic.Assignment#' + this.id,
      name: this.formData.name.value,
      gradeRequired: this.formData.gradeRequired.value
    };

    this.showLoader = true;
    return this.assignmentService.updateParticipant(this.Transaction)
      .toPromise()
      .then(() => {
        this.showLoader = false;
        this.snackBar.open('Assignment updated successfully!', 'Close', {
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
        subject: 'this assignment'
      }
    };

    const dialogRef = this.dialog.open(WarningComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.showLoader = true;
          this.assignmentService.deleteParticipant(this.assignment.assignmentId)
            .toPromise()
            .then(() => {
              this.showLoader = false;
              this.router.navigate(['/assignments']);
              this.snackBar.open('Assignment deleted successfully!', 'Close', {
                duration: 2000
              });
            })
            .catch(error => this.handleError(error));
        }
      });
  }

  commitStudentAssignment(student: StudentNode, grade, passed, studentAssignment?) {
    this.showLoader = true;
    if (studentAssignment) {
      // update
      this.assignmentService.updateStudentAssignment({
        grade,
        passed,
        studentAssignment: 'org.ogma.academic.StudentAssignment#' + studentAssignment.studentAssignmentId
      })
        .toPromise()
        .then(() => {
          this.showLoader = false;
          this.snackBar.open('Successfully updated student\'s assignment results!', 'Close', {
            duration: 2000
          });
        });
    } else {
      // create
      this.assignmentService.addStudentAssignment({
        grade,
        passed,
        student: 'org.ogma.academic.Student#' + student.id,
        assignment: 'org.ogma.academic.Assignment#' + this.assignment.assignmentId
      })
        .toPromise()
        .then(() => {
          return this.assignmentService.getAllStudentAssignments({
            and: [
              {student: 'resource:org.ogma.academic.Student#' + student.id},
              {assignment: 'resource:org.ogma.academic.Assignment#' + this.assignment.assignmentId}
              ]
          }).toPromise();
        })
        .then((result: StudentAssignment[]) => {
          student.studentAssignment = result[0];
          this.showLoader = false;
          this.snackBar.open('Successfully added student to assignment!', 'Close', {
            duration: 2000
          });
        })
        .catch(error => this.handleError(error));
    }
  }

  deleteStudentAssignment(student: StudentNode) {
    this.showLoader = true;
    this.assignmentService.deleteStudentAssignment(student.studentAssignment.studentAssignmentId)
      .toPromise()
      .then(() => {
        delete student.studentAssignment;
        this.showLoader = false;

        this.snackBar.open('Successfully removed student from assignment!', 'Close', {
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
