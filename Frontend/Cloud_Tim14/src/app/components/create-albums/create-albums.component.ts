import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-albums',
  templateUrl: './create-albums.component.html',
  styleUrls: ['./create-albums.component.css']
})
export class CreateAlbumsComponent {
  @Output() clicked:EventEmitter<boolean> = new EventEmitter<boolean>(); 
  openAddFolderDialog(){
    this.clicked.emit(true);
  }
}
