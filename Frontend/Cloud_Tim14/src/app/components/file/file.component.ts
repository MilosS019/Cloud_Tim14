import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MyFile } from '../../models/myFile.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { PermissionService } from 'src/app/services/permission.service';

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
  isAreYouSureDialogDisplayed: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() path: string = "";
  @Output() closing:EventEmitter<boolean> = new EventEmitter<boolean>(); 
  @Output() download:EventEmitter<string> = new EventEmitter<string>();
  @Output() moved: EventEmitter<string> = new EventEmitter<string>();
  @Output() movedToAlbum: EventEmitter<[string,string]> = new EventEmitter();



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
  constructor(private router: Router, private fileService:FileService, private permissionService: PermissionService) {}

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
    this.permissionService.addPermission({"granted_user" : userEmail, "file_path":this.path + this.file.name}).subscribe({
      next: data => {
        console.log(data)
      }
    })
  }
  removeFileSharing(): void {
    let userEmail: string = this.removeSharingFormGroup.value.email;
    this.isRemoveSharingFormDisplayed = false;
    this.permissionService.removePermission({"granted_user" : userEmail, "file_path":this.path + this.file.name}).subscribe({
      next: data => {
        console.log(data)
      }
    })
  }

  editFile(): void {
    this.isEditFileDisplayed = true;
  }

  closeEditFile(file:MyFile){
    this.file = file
    this.isEditFileDisplayed = false;
  }

  downloadFile(): void {
    this.download.emit(this.file.name);
  }

  changeAlbum(): void {
    this.movedToAlbum.emit([this.changeAlbumFormGroup.value.albumName, this.file.name])
    this.isChangeAlbumFromDisplayed = false;
  }

  openAreYouSureDialog(){
    this.isAreYouSureDialogDisplayed = true;
  }

  deleteFile(): void {
    this.isAreYouSureDialogDisplayed = false;
    console.log(this.path + this.file.name)
    this.fileService.removeFile(this.path + this.file.name).subscribe({
      next: data => {
        console.log(data)
        this.moved.emit("")
      }
    })
  }

  close():void{
    this.closing.emit(true);
  }

  updateFileValues(file:MyFile){
    this.file = file;
    this.moved.emit("")
  }

  closeAreYouSureDialog(){
    this.isAreYouSureDialogDisplayed = false;
  }
}
