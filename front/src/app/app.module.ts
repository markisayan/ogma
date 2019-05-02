import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MaterialModule} from './material';
import {NavbarComponent} from './navbar/navbar.component';
import {LoginComponent} from './dialogs/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StudentAddComponent} from './student/student-add/student-add.component';
import {StudentUpdateComponent} from './student/student-update/student-update.component';
import {StudentListComponent} from './student/student-list/student-list.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {WarningComponent} from './dialogs/warning/warning.component';
import {ImageUploadComponent} from './dialogs/image-upload/image-upload.component';
import {StudentViewComponent} from './student/student-view/student-view.component';
import {UniversityAddComponent} from './university/university-add/university-add.component';
import {UniversityUpdateComponent} from './university/university-update/university-update.component';
import {UniversityListComponent} from './university/university-list/university-list.component';
import {UniversityViewComponent} from './university/university-view/university-view.component';
import {ProfessorAddComponent} from './professor/professor-add/professor-add.component';
import {ProfessorListComponent} from './professor/professor-list/professor-list.component';
import {ProfessorUpdateComponent} from './professor/professor-update/professor-update.component';
import {ProfessorViewComponent} from './professor/professor-view/professor-view.component';
import {DepartmentAddComponent} from './department/department-add/department-add.component';
import {DepartmentListComponent} from './department/department-list/department-list.component';
import {DepartmentUpdateComponent} from './department/department-update/department-update.component';
import {DepartmentViewComponent} from './department/department-view/department-view.component';
import {MinistryAddComponent} from './ministry/ministry-add/ministry-add.component';
import {MinistryListComponent} from './ministry/ministry-list/ministry-list.component';
import {MinistryUpdateComponent} from './ministry/ministry-update/ministry-update.component';
import {MinistryViewComponent} from './ministry/ministry-view/ministry-view.component';
import {AssignmentAddComponent} from './assignment/assignment-add/assignment-add.component';
import {AssignmentListComponent} from './assignment/assignment-list/assignment-list.component';
import {AssignmentUpdateComponent} from './assignment/assignment-update/assignment-update.component';
import {CourseAddComponent} from './course/course-add/course-add.component';
import {CourseListComponent} from './course/course-list/course-list.component';
import {CourseUpdateComponent} from './course/course-update/course-update.component';
import {CourseViewComponent} from './course/course-view/course-view.component';
import {AssignmentViewComponent} from './assignment/assignment-view/assignment-view.component';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './data.service';
import {CountryPipe} from './country.pipe';
import {GlobalSettingsService} from './global-settings.service';
import {NotFoundComponent} from './not-found/not-found.component';
import {ListComponent} from './pages/list/list.component';
import {ViewComponent} from './pages/view/view.component';
import {DatePipe} from '@angular/common';
import {MinistryService} from './ministry/ministry.service';
import {UniversityService} from './university/university.service';
import {DepartmentService} from './department/department.service';
import {StudentCourse} from './org.ogma.academic';
import {StudentService} from './student/student.service';
import {ProfessorService} from './professor/professor.service';
import {CourseService} from './course/course.service';
import {AssignmentService} from './assignment/assignment.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    StudentAddComponent,
    StudentUpdateComponent,
    StudentListComponent,
    SidenavComponent,
    WarningComponent,
    ImageUploadComponent,
    StudentViewComponent,
    UniversityAddComponent,
    UniversityUpdateComponent,
    UniversityListComponent,
    UniversityViewComponent,
    ProfessorAddComponent,
    ProfessorListComponent,
    ProfessorUpdateComponent,
    ProfessorViewComponent,
    DepartmentAddComponent,
    DepartmentListComponent,
    DepartmentUpdateComponent,
    DepartmentViewComponent,
    MinistryAddComponent,
    MinistryListComponent,
    MinistryUpdateComponent,
    MinistryViewComponent,
    AssignmentAddComponent,
    AssignmentListComponent,
    AssignmentUpdateComponent,
    AssignmentViewComponent,
    CourseAddComponent,
    CourseListComponent,
    CourseUpdateComponent,
    CourseViewComponent,
    CountryPipe,
    NotFoundComponent,
    ListComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    GlobalSettingsService,
    CountryPipe,
    DatePipe,
    MinistryService,
    UniversityService,
    DepartmentService,
    StudentService,
    ProfessorService,
    CourseService,
    AssignmentService
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, WarningComponent, ImageUploadComponent]
})
export class AppModule {
}
