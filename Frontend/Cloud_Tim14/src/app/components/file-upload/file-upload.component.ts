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

  getTagsAsString(tags:string[]){
    let tagsAsStr = ""
    for(let tag of tags){
      tagsAsStr += "," + tag
    }
    return tagsAsStr.slice(1, tagsAsStr.length)
  }

  async upload(){
    if (!this.file){
      alert("file not selected")
      return;
    }
    let tagsAsString = this.getTagsAsString(this.tags)
    let today = new Date() 
    const fileInfoParams = {
        path: this.path + this.file.name,
        type: this.file.type,
        size: this.file.size,
        creationDate: today.toString(), 
        lastModified: today.toString(),
        description: this.description.value,
        tags: tagsAsString
      }
    const fileReader = new FileReader();
    this.fileService.getLogedInEmail().subscribe({
      next: async data => {
        await this.setUpFileReader(fileReader, fileInfoParams, data["email"]) 
        fileReader.readAsDataURL(this.file!)
      },
      error: data => {

      }
    })
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

  async setUpFileReader(fileReader:FileReader, fileInfoParams:any, email:string){
    fileReader.onload = () => {
      const fileData = fileReader.result;
      const payload = {
        file: fileData,
        fileParams: fileInfoParams,
        path: this.path + this.file?.name,
        email:email
      };
    
      const jsonData = JSON.stringify(payload);
    
      this.fileService.uploadFile(jsonData).subscribe(
        data => {
          // this.fileService.uploadMetaData(fileInfoParams).subscribe(
          //   data => {
          //     alert("File uploaded succsefully")
          //     this.update();
          //   }
          // );
          console.log(data)
          this.update();
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
