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
