import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css'],
})
export class CreateAlbumComponent {
  @Output() close:EventEmitter<string> = new EventEmitter<string>(); 
  @Input() previousPath:string = "/";
  private formBuilder: FormBuilder = new FormBuilder();
  public formGroup: FormGroup = this.formBuilder.group({
    albumName: ['', Validators.required],
  });
  constructor(private fileService:FileService) {
  }

  public createAlbum(): void {
    const payload = {
      file: "",
      path: this.previousPath + this.formGroup.get("albumName")?.value + "/"
    };
  
      const jsonData = JSON.stringify(payload);
    
      this.fileService.uploadFolder(jsonData).subscribe(
        data => {
          console.log(data);
          this.close.emit(this.formGroup.get("albumName")?.value)
        }
      );
  }

  closeFunction(){
    this.close.emit("");
  }


}
