import { Component, OnInit } from '@angular/core';
import { MyFile } from '../../models/myFile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoAlbum } from '../../models/photoAlbum.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  files: Array<MyFile> = new Array();
  photoAlbum: PhotoAlbum = {} as PhotoAlbum;

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe((params) => {
      const myObject: PhotoAlbum = JSON.parse(params['object']);
      this.photoAlbum = myObject;
    });

    // ucitati sada fajove na osnovu naziva albuma
  }
  constructor(private activatedRouter: ActivatedRoute, private router: Router) {
    let file1: MyFile = {
      name: 'file1',
      size: 10,
      creationDate: '12.12.2020',
      lastModifiedDate: '12.12.2021',
      type: 'pdf',
      description: 'description',
      tags: ['tag1', 'tag2'],
    };
    let file2: MyFile = {
      name: 'file2',
      size: 10,
      creationDate: '12.12.2020',
      lastModifiedDate: '12.12.2021',
      type: 'pdf',
      description: 'description',
      tags: ['tag1', 'tag2'],
    };
    let file3: MyFile = {
      name: 'file2',
      size: 10,
      creationDate: '12.12.2020',
      lastModifiedDate: '12.12.2021',
      type: 'pdf',
      description: 'description',
      tags: ['tag1', 'tag2'],
    };
    let file4: MyFile = {
      name: 'file2',
      size: 10,
      creationDate: '12.12.2020',
      lastModifiedDate: '12.12.2021',
      type: 'pdf',
      description: 'description',
      tags: ['tag1', 'tag2'],
    };
    this.files.push(file1, file2, file3, file4, file1);
  }
}
