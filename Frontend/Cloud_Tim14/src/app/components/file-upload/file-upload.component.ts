import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() closing:EventEmitter<string> = new EventEmitter<string>();  
  updatedPath:string = "/";
  file:File | undefined;

  constructor(private fileService:FileService) {

  }

  onFileSelected(event:any) {
      this.file = event.target.files[0];
      if(this.file)
        this.fileName = this.file.name
    }

  async upload(){
    if (!this.file){
      alert("file not selected")
      return;
    }
    const fileInfoParams = JSON.stringify({
        path: this.path + this.file.name,
        type: this.file.type,
        size: this.file.size,
        lastModified: this.file.lastModified,
        description: this.description.value,
        tags: this.tags
      })
    console.log(this.path)
    const fileReader = new FileReader();
    await this.setUpFileReader(fileReader, fileInfoParams) 
    fileReader.readAsDataURL(this.file)
    // const formData : FormData = new FormData;
    // formData.append('file', this.file)
    // formData.append('path', this.path)
    // console.log(formData)
    // this.fileService.uploadFile(formData).subscribe({
    //   next: data =>{
        // this.fileService.uploadMetaData(fileInfoParams).subscribe(
        //   data => {
        //     console.log(data)
        //     alert("File uploaded succsefully")
        //     this.update();
        //   }
        // );
    //   }
    // })

  }

  async setUpFileReader(fileReader:FileReader, fileInfoParams:any){
    fileReader.onload = () => {
      const fileData = fileReader.result;
      console.log(fileData)
      const payload = {
        file: fileData,
        path: this.path + this.file?.name
      };
    
      const jsonData = JSON.stringify(payload);
    
      this.fileService.uploadFile(jsonData).subscribe(
        data => {
          this.fileService.uploadMetaData(fileInfoParams).subscribe(
            data => {
              console.log(data)
              alert("File uploaded succsefully")
              this.update();
            }
          );
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

  update(){
    this.closing.emit(this.fileName)
  }

  
}
