import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent {
  @Output() albumOpening :EventEmitter<string> = new EventEmitter();
  @Output() renamed: EventEmitter<[string,string]> = new EventEmitter();
  @Output() deleted: EventEmitter<string> = new EventEmitter();
  isShareFormDisplayed: boolean = false;
  isRemoveSharingFormDisplayed: boolean = false;
  areYouSureDialog:boolean = false;
  areYouSureDialogDelete:boolean = false;


  callbackFunction:any;

  shareFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  removeSharingFormGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  @Input() isReadOnly:boolean = false;
  @Input() album: PhotoAlbum = { name: 'NO NAME', numberOfFiles: 0 };
  @Input() path: string = "";
  constructor(private router: Router, private permissionService:PermissionService) {}

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
    this.permissionService.addPermission({"granted_user" : userEmail, "file_path":this.path + this.album.name + "/"}).subscribe({
      next: data => {
        console.log(data)
      },
      error: data => {
        console.log(data)
      }
    })
    this.isShareFormDisplayed = false;
  }
  removeAlbumSharing(): void {
    let userEmail: string = this.removeSharingFormGroup.value.email;
    this.permissionService.removePermission({"granted_user" : userEmail, "file_path":this.path}).subscribe({
      next: data => {
        console.log(data)
      },
      error: data => {
        console.log(data)
      }
    })
    this.isRemoveSharingFormDisplayed = false;
  }

  deleteAlbum(): void {
    this.areYouSureDialogDelete = true
    this.callbackFunction = this.delete
  }

  delete(){
    this.deleted.emit(this.album.name)
    this.areYouSureDialogDelete = false
  }

  openAlbum(): void {
    this.albumOpening.emit(this.album.name)
  }
  
  rename(input:any){
    input.disabled = false;
  }
  
  startSaving(){
    this.areYouSureDialog = true;
    this.callbackFunction = this.save
  }
  
  save(input:any){
    this.disableInput(input)
    this.areYouSureDialog = false;
    this.renamed.emit([this.album.name, input.value])
  }
  
  disableInput(input:any){
    input.disabled = true;
  }
  
  closeAreYouSureDialog(){
    this.areYouSureDialog = false;
  }

}
