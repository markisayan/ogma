import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {LoginComponent} from '../dialogs/login/login.component';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {map, filter, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  private isLoggedIn: boolean;
  title: string;
  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.isLoggedIn = true;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }

        return route;
      }))
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      .subscribe((event) => {
        this.titleService.setTitle(event.title);
        this.title = event.title;
      });
  }

  openDialog() {
    const dialogConfig = {
      disableClose: true,
      autoFocus: true,
      width: '600px',
      height: '300px'
    };

    this.dialog.open(LoginComponent, dialogConfig);
  }

}
