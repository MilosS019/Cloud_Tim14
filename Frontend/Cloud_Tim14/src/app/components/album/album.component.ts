import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent {
  @Output() albumOpening :EventEmitter<string> = new EventEmitter();
  isShareFormDisplayed: boolean = false;
  isRemoveSharingFormDisplayed: boolean = false;

  shareFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  removeSharingFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  @Input() album: PhotoAlbum = { name: 'NO NAME', numberOfFiles: 0 };
  constructor(private router: Router) {}

  openShareAlbumForm(): void {
    this.isShareFormDisplayed = true;
  }
  closeShareAlbumForm(): void {
    this.isShareFormDisplayed = false;
  }
  openRemoveSharingAlbumForm(): void {
    this.isRemoveSharingFormDisplayed = true;
  }
  closeRemoveSharingAlbumForm(): void {
    this.isRemoveSharingFormDisplayed = false;
  }

  shareAlbum(): void {
    let userEmail: string = this.shareFormGroup.value.email;
    this.isShareFormDisplayed = false;
  }
  removeAlbumSharing(): void {
    let userEmail: string = this.removeSharingFormGroup.value.email;
    this.isRemoveSharingFormDisplayed = false;
  }

  deleteAlbum(): void {}

  openAlbum(): void {
    this.albumOpening.emit(this.album.name)
  }
}
