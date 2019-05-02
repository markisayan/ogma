import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudentAddComponent} from './student/student-add/student-add.component';
import {StudentListComponent} from './student/student-list/student-list.component';
import {StudentUpdateComponent} from './student/student-update/student-update.component';
import {StudentViewComponent} from './student/student-view/student-view.component';

import {MinistryListComponent} from './ministry/ministry-list/ministry-list.component';
import {MinistryAddComponent} from './ministry/ministry-add/ministry-add.component';
import {MinistryViewComponent} from './ministry/ministry-view/ministry-view.component';
import {MinistryUpdateComponent} from './ministry/ministry-update/ministry-update.component';

import {UniversityListComponent} from './university/university-list/university-list.component';
import {UniversityAddComponent} from './university/university-add/university-add.component';
import {UniversityViewComponent} from './university/university-view/university-view.component';
import {UniversityUpdateComponent} from './university/university-update/university-update.component';

import {DepartmentUpdateComponent} from './department/department-update/department-update.component';
import {DepartmentListComponent} from './department/department-list/department-list.component';
import {DepartmentAddComponent} from './department/department-add/department-add.component';
import {DepartmentViewComponent} from './department/department-view/department-view.component';

import {AssignmentListComponent} from './assignment/assignment-list/assignment-list.component';
import {AssignmentAddComponent} from './assignment/assignment-add/assignment-add.component';
import {AssignmentViewComponent} from './assignment/assignment-view/assignment-view.component';
import {AssignmentUpdateComponent} from './assignment/assignment-update/assignment-update.component';

import {CourseListComponent} from './course/course-list/course-list.component';
import {CourseAddComponent} from './course/course-add/course-add.component';
import {CourseViewComponent} from './course/course-view/course-view.component';
import {CourseUpdateComponent} from './course/course-update/course-update.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ProfessorListComponent} from './professor/professor-list/professor-list.component';
import {ProfessorAddComponent} from './professor/professor-add/professor-add.component';
import {ProfessorUpdateComponent} from './professor/professor-update/professor-update.component';
import {ProfessorViewComponent} from './professor/professor-view/professor-view.component';

const routes: Routes = [
  {path: 'students', component: StudentListComponent, data: {title: 'All students'}},
  {path: 'students/add', component: StudentAddComponent, data: {title: 'Add student'}},
  {path: 'students/view/:id', component: StudentViewComponent, data: {title: 'View student'}},
  {path: 'students/edit/:id', component: StudentUpdateComponent, data: {title: 'Edit student'}},

  {path: 'ministries', component: MinistryListComponent, data: {title: 'All ministries'}},
  {path: 'ministries/add', component: MinistryAddComponent, data: {title: 'Add ministry'}},
  {path: 'ministries/view/:id', component: MinistryViewComponent, data: {title: 'View ministry'}},
  {path: 'ministries/edit/:id', component: MinistryUpdateComponent, data: {title: 'Edit ministry'}},

  {path: 'universities', component: UniversityListComponent, data: {title: 'All universities'}},
  {path: 'universities/add', component: UniversityAddComponent, data: {title: 'Add university'}},
  {path: 'universities/view/:id', component: UniversityViewComponent, data: {title: 'View university'}},
  {path: 'universities/edit/:id', component: UniversityUpdateComponent, data: {title: 'Edit university'}},

  {path: 'departments', component: DepartmentListComponent, data: {title: 'All departments'}},
  {path: 'departments/add', component: DepartmentAddComponent, data: {title: 'Add department'}},
  {path: 'departments/view/:id', component: DepartmentViewComponent, data: {title: 'View department'}},
  {path: 'departments/edit/:id', component: DepartmentUpdateComponent, data: {title: 'Edit department'}},

  {path: 'assignments', component: AssignmentListComponent, data: {title: 'All assignments'}},
  {path: 'assignments/add', component: AssignmentAddComponent, data: {title: 'Add assignment'}},
  {path: 'assignments/view/:id', component: AssignmentViewComponent, data: {title: 'View assignment'}},
  {path: 'assignments/edit/:id', component: AssignmentUpdateComponent, data: {title: 'Edit assignment'}},

  {path: 'courses', component: CourseListComponent, data: {title: 'All courses'}},
  {path: 'courses/add', component: CourseAddComponent, data: {title: 'Add course'}},
  {path: 'courses/view/:id', component: CourseViewComponent, data: {title: 'View course'}},
  {path: 'courses/edit/:id', component: CourseUpdateComponent, data: {title: 'Edit course'}},

  {path: 'professors', component: ProfessorListComponent, data: {title: 'All professors'}},
  {path: 'professors/add', component: ProfessorAddComponent, data: {title: 'Add professor'}},
  {path: 'professors/view/:id', component: ProfessorViewComponent, data: {title: 'View professor'}},
  {path: 'professors/edit/:id', component: ProfessorUpdateComponent, data: {title: 'Edit professor'}},
  {path: '404', component: NotFoundComponent},
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
