import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {
  
  fileName:string = '';
  description:FormControl = new FormControl('');
  tag:FormControl = new FormControl('')
  tags:string[] = []
  @Input() path:string = "/";
  updatedPath:string = "/";
  file:File | undefined;

  constructor(private fileService:FileService) {

  }

  onFileSelected(event:any) {
      this.file = event.target.files[0];
      this.path = this.updatedPath
      if(this.file)
        this.fileName = this.file.name
    }

  async upload(){
    if (!this.file){
      alert("file not selected")
      return;
    }
    this.path += this.file.name
    const fileInfoParams = JSON.stringify({
        path: this.path,
        type: this.file.type,
        size: this.file.size,
        lastModified: this.file.lastModified,
        description: this.description.value,
        tags: this.tags
      })

    const fileReader = new FileReader();
    await this.setUpFileReader(fileReader) 
    fileReader.readAsDataURL(this.file)
    this.fileService.uploadMetaData(fileInfoParams).subscribe(
      data => {
        console.log(data)
      }
    );

  }

  async setUpFileReader(fileReader:FileReader){
    fileReader.onload = () => {
      const fileData = fileReader.result;
      const payload = {
        file: fileData,
        path: this.path
      };
    
      const jsonData = JSON.stringify(payload);
    
      this.fileService.uploadFile(jsonData).subscribe(
        data => {
          console.log(data);
        }
      );
    };
  }

  addTag(){
    this.tags.push(this.tag.value);
  }

  removeTag(index:number){
    this.tags.splice(index,index + 1)
  }

}
