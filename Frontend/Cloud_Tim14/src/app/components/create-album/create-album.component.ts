import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css'],
})
export class CreateAlbumComponent {
  private formBuilder: FormBuilder = new FormBuilder();
  public formGroup: FormGroup = this.formBuilder.group({
    albumName: ['', Validators.required],
  });

  public createAlbum(): void {}
}
