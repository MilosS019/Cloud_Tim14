import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-are-you-sure-dialog',
  templateUrl: './are-you-sure-dialog.component.html',
  styleUrls: ['./are-you-sure-dialog.component.css']
})
export class AreYouSureDialogComponent {
  @Output() yes:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() no:EventEmitter<boolean> = new EventEmitter<boolean>();

  sendYes(){
    this.yes.emit(true);
  }

  sendNo(){
    this.no.emit(true);
  }
}
