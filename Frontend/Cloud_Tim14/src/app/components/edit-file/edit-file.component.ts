import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyFile } from '../../models/myFile.model';

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
  file: MyFile = {} as MyFile;

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params) => {
      const myObject: MyFile = JSON.parse(params['object']);
      this.file = myObject;
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
    private router: Router
  ) {}

  addTag(): void {
    let tag = this.formGroup.value.tag;
    this.tags.push(tag);
  }

  updateFile(): void {
    let fileName: string = this.formGroup.value.fileName;
    let description: string = this.formGroup.value.description;
    this.file.name = fileName;
    this.file.description = description;
    this.file.tags = this.tags;
    alert('File update!');
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }
}
