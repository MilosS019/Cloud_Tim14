import { Component, Input } from '@angular/core';
import { MyFile } from '../../models/myFile.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css'],
})
export class FileComponent {
  isShareFormDisplayed: boolean = false;
  isRemoveSharingFormDisplayed: boolean = false;
  isChangeAlbumFromDisplayed: boolean = false;

  shareFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  removeSharingFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  changeAlbumFormGroup: FormGroup = new FormGroup({
    albumName: new FormControl(''),
  });

  @Input() file: MyFile = {} as MyFile;
  constructor(private router: Router) {}

  openShareFileForm(): void {
    this.isShareFormDisplayed = true;
  }
  closeShareFileForm(): void {
    this.isShareFormDisplayed = false;
  }
  openRemoveSharingFileForm(): void {
    this.isRemoveSharingFormDisplayed = true;
  }
  closeRemoveSharingFileForm(): void {
    this.isRemoveSharingFormDisplayed = false;
  }

  openChangeAlbumForm(): void {
    this.isChangeAlbumFromDisplayed = true;
  }
  closeChangeAlbumForm(): void {
    this.isChangeAlbumFromDisplayed = false;
  }

  shareFile(): void {
    let userEmail: string = this.shareFormGroup.value.email;
    this.isShareFormDisplayed = false;
  }
  removeFileSharing(): void {
    let userEmail: string = this.removeSharingFormGroup.value.email;
    this.isRemoveSharingFormDisplayed = false;
  }

  editFile(): void {
    const queryParams = { object: JSON.stringify(this.file) };
    this.router.navigate(['file-edit'], { queryParams });
  }

  downloadFile(): void {}

  changeAlbum(): void {
    let albumName: string = this.changeAlbumFormGroup.value.albumName;
    this.isChangeAlbumFromDisplayed = false;
  }

  deleteFile(): void {}
}
