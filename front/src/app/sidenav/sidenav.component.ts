import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  showSidenav: boolean;
  menuItems: Array<{name: string, icon: string, location: string}>;
  constructor() {
    this.menuItems = [
      { name: 'Ministries', icon: 'account_balance', location: 'ministries' },
      { name: 'Universities', icon: 'domain', location: 'universities' },
      { name: 'Departments', icon: 'group', location: 'departments' },
      { name: 'Professors', icon: 'how_to_reg', location: 'professors' },
      { name: 'Students', icon: 'school', location: 'students' },
      { name: 'Courses', icon: 'local_library', location: 'courses' },
      { name: 'Assignments', icon: 'list_alt', location: 'assignments' }];
  }

  ngOnInit() {
  }
}
