import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  uploadedData: string | ArrayBuffer;
  constructor(
    public dialogRef: MatDialogRef<ImageUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close(this.uploadedData);
  }

  onDelete() {
    this.dialogRef.close('noimg');
  }

  handleFileInput(files: FileList) {
    const fileToUpload = files.item(0);
    if (!fileToUpload) {
      return;
    }
    const myReader = new FileReader();

    myReader.onloadend = () => {
      this.uploadedData = myReader.result;
    };
    myReader.readAsDataURL(fileToUpload);
  }
}
