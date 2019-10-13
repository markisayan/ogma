import {Component, OnInit} from '@angular/core';
import {Department, University} from '../../org.ogma.participant';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../../department/department.service';
import {GlobalSettingsService} from '../../global-settings.service';
import {DatePipe} from '@angular/common';
import {CountryPipe} from '../../country.pipe';
import {UniversityService} from '../../university/university.service';
import {StudentService} from '../student.service';
import {Course, Student, StudentAssignment, StudentCourse} from '../../org.ogma.academic';
import {CourseService} from '../../course/course.service';
import {AssignmentService} from '../../assignment/assignment.service';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import {Chart} from 'chart.js';
import {Label} from 'ng2-charts';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {
  private student: Student;
  private isDataLoaded = false;
  private courses: StudentCourse[];
  private assignments: StudentAssignment[];
  private chart = [];
  public chartData = {};
  constructor(private snackBar: MatSnackBar,
              private titleService: Title,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private departmentService: DepartmentService,
              private universityService: UniversityService,
              private studentService: StudentService,
              private courseService: CourseService,
              private assignmentService: AssignmentService,
              private globalSettings: GlobalSettingsService,
              private datePipe: DatePipe,
              private countryPipe: CountryPipe) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.load(id)
      .then(() => this.loadStudentsCourses())
      .then(() => this.loadStudentsAssignments())
      .then(() => {
        this.constructChartData();
        this.isDataLoaded = true;
      });
  }

  constructChartData() {
    const kek = {};
    this.assignments.forEach(a => kek[a.assignment.course.courseId] = a.assignment.course);
    const coursesStudentAttends = [];

    for (const k in kek) {
      if (kek.hasOwnProperty(k)) {
        coursesStudentAttends.push(kek[k]);
      }
    }

    console.log(coursesStudentAttends.map(c => c.name))
    this.chartData = {
      options: {
        responsive: true,
        scales: { xAxes: [{}], yAxes: [{
            beginAtZero: true,
            min: 0,
            max: 100,
          }] }
      },
      legend: false,
      plugins: [pluginDataLabels],
      labels: coursesStudentAttends.map(c => c.name),
      type: 'bar',

      data: [{
        data: coursesStudentAttends
          .map(c => {
              const assignments = this.assignments.filter(a => a.assignment.course.courseId === c.courseId);
              const avg = Math.round((assignments.reduce((acc, cur) => acc + +cur.grade, 0) / assignments.length) * 100) / 100;
              return avg;
            }),

        backgroundColor: '#3e95cd',
        }]
    };
  }

  load(id): Promise<any> {
    return this.studentService.getParticipant(id)
      .toPromise()
      .then((student: Student) => {
        this.student = student;
      })
      .catch(error => this.handleError(error));
  }

  loadStudentsCourses(): Promise<any> {
    return this.courseService.getAllStudentCourses({student: 'resource:org.ogma.academic.Student#' + this.student.studentId})
      .toPromise()
      .then((courses: StudentCourse[]) => {
        this.courses = courses;
      });
  }

  loadStudentsAssignments(): Promise<any> {
    return this.assignmentService.getAllStudentAssignments({student: 'resource:org.ogma.academic.Student#' + this.student.studentId})
      .toPromise()
      .then((assignments: StudentAssignment[]) => {
        this.assignments = assignments;
      });
  }


  handleError(error) {
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
