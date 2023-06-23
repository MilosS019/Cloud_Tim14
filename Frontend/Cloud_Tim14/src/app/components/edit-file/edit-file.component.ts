import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyFile } from '../../models/myFile.model';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.css'],
})
export class EditFileComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    fileName: new FormControl(''),
    description: new FormControl(''),
    tag: new FormControl(''),
  });
  tags: Array<string> = [];
  @Input() path : string = "";
  @Input() file: MyFile = {} as MyFile;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatedFile: EventEmitter<MyFile> = new EventEmitter();

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params) => {
      this.formGroup.setValue({
        fileName: this.file.name,
        description: this.file.description,
        tag: '',
      });
      this.tags = this.file.tags;
    });
  }
  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private fileService: FileService
  ) {}

  addTag(): void {
    let tag = this.formGroup.value.tag;
    this.tags.push(tag);
  }

  updateFile(): void {
    if(this.formGroup.value.fileName == this.file.name){
      const fileInfoParams = JSON.stringify({
        path: this.path + this.file.name,
        lastModified: Date.now(),
        description: this.formGroup.value.description,
        tags: this.tags
      })
      this.updateFileValues()
      this.fileService.updateMetaData(fileInfoParams).subscribe({
        next: data => {
          console.log(data)
        },
        error: data=> {
          console.log(data)
        }
      });
    }
    else{
      const fileInfoParams = JSON.stringify({
        oldPath: this.path + this.file.name, 
        path: this.path + this.formGroup.value.fileName,
        type: this.file.type,
        size: this.file.size,
        lastModified: Date.now(),
        description: this.formGroup.value.description,
        tags: this.tags
      })
      this.fileService.moveFile({"oldPath":this.path + this.file.name, "newPath":this.path + this.formGroup.value.fileName}).subscribe({
        next: data => {
          this.renameMetaData(fileInfoParams)
          this.updateFileValues()
        },
        error: data=>{
          
        }
      })
    }
  }

  updateFileValues(){
    this.file.name = this.formGroup.value.fileName
    this.file.description = this.formGroup.value.description
    this.file.tags = this.tags
    this.updatedFile.emit(this.file)
  }

  renameMetaData(fileInfoParams: any){
    this.fileService.renameMetaData(fileInfoParams).subscribe({
      next: data => {
        
      },
      error: data => {

      }
    })
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  closeEditFileDialog(){
    this.close.emit()
  }
}
