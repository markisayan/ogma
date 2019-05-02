import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private login: string;
  private password: string;
  constructor(
    public dialogRef: MatDialogRef<LoginComponent>) {}

  loginClick() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
