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
  @Output() close: EventEmitter<MyFile> = new EventEmitter<MyFile>();
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

  getTagsAsString(tags:string[]){
    let tagsAsStr = ""
    for(let tag of tags){
      tagsAsStr += "," + tag
    }
    return tagsAsStr.slice(1, tagsAsStr.length)
  }
  

  updateFile(): void {
    if(this.formGroup.value.fileName == this.file.name){
      let today = new Date()
      const fileInfoParams = JSON.stringify({
        path: this.path + this.file.name,
        lastModified: today.toString(),
        description: this.formGroup.value.description,
        tags: this.getTagsAsString(this.tags)
      })
      this.updateFileValues()
      this.fileService.updateMetaData(fileInfoParams).subscribe({
        next: data => {
          console.log(data)
          console.log(this.tags)
          this.file.name = this.formGroup.value.fileName
          this.file.description = this.formGroup.value.description
          this.file.lastModifiedDate = today.toString()
          this.file.tags = this.tags
          this.close.emit(this.file)
        },
        error: data=> {
          console.log(data)
        }
      });
    }
    else{
      let today = new Date()
      const fileInfoParams = {
        oldPath: this.path + this.file.name, 
        path: this.path + this.formGroup.value.fileName,
        type: this.file.type,
        size: this.file.size,
        creationDate: this.file.creationDate,
        lastModified: today.toString(),
        description: this.formGroup.value.description,
        tags: this.getTagsAsString(this.tags)
      }
      console.log(this.tags)
      this.fileService.getLogedInEmail().subscribe({
        next: data => {
          this.fileService.moveFile({"oldPath":this.path + this.file.name, "newPath":this.path + this.formGroup.value.fileName, "email":data["email"], "fileParams":fileInfoParams}).subscribe({
            next: data => {
              console.log(data)
              this.file.name = this.formGroup.value.fileName
              this.file.description = this.formGroup.value.description
              this.file.lastModifiedDate = today.toString()
              this.file.tags = this.tags
              this.close.emit(this.file)
              this.updateFileValues()
            },
            error: data=>{
              console.log(data)
              this.close.emit(this.file)
            }
          })
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

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  closeEditFileDialog(){
    this.close.emit()
  }
}
