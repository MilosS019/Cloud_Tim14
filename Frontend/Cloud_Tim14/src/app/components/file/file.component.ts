import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  isEditFileDisplayed: boolean = false;   
  @Input() path: string = "";
  @Output() closing:EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Output() download:EventEmitter<string> = new EventEmitter<string>();
  @Output() moved: EventEmitter<boolean> = new EventEmitter<boolean>();


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
    this.isEditFileDisplayed = true;
  }

  closeEditFile(){
    this.isEditFileDisplayed = false;
  }

  downloadFile(): void {
    this.download.emit(this.file.name);
  }

  changeAlbum(): void {
    let albumName: string = this.changeAlbumFormGroup.value.albumName;
    this.isChangeAlbumFromDisplayed = false;
  }

  deleteFile(): void {}

  close():void{
    this.closing.emit(true);
  }

  updateFileValues(file:MyFile){
    this.file = file;
    this.moved.emit(true)
  }
}
