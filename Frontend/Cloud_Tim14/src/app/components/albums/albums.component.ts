import { Component } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent {
  albums: Array<PhotoAlbum> = [];
  constructor() {
    let album1: PhotoAlbum = { name: 'Album1', numberOfFiles: 3 };
    let album2: PhotoAlbum = { name: 'Album2', numberOfFiles: 5 };
    this.albums.push(album1, album2);
  }
}
