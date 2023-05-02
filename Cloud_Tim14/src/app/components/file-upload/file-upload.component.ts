import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {
  
  fileName:string = '';
  descritpion:FormControl = new FormControl('');
  tag:FormControl = new FormControl('')
  tags:string[] = []
  file:File | undefined;

  constructor() {

  }

  onFileSelected(event:any) {
      this.file = event.target.files[0];
      if(this.file)
        this.fileName = this.file.name
    }

  upload(){
    if (!this.file){
      alert("file not selected")
      return;
    }
    const fileParams = {
      Bucket: "cloud-project-files-bucket", // The name of the bucket. For example, 'sample-bucket-101'.
      Key: this.file.name, // The name of the object. For example, 'sample_upload.txt'.
      Body: this.file, // The content of the object. For example, 'Hello world!".
    };

    let name:string = this.file.name
    let infoFileName:string = name.split(".")[0];
    const fileInfoParams = { 
      Bucket: "cloud-project-files-info",
      Key: infoFileName + ".json",
      Body: JSON.stringify({
        name: infoFileName + ".json",
        type: this.file.type,
        size: this.file.size,
        lastModified: this.file.lastModified,
        descritpion: this.descritpion.value,
        tags: this.tags
      })
    }
    let s3Client:S3Client;
    s3Client = new S3Client({region:"eu-north-1", credentials:{
      accessKeyId: "AKIA4IB5G6SAVTWWTL7Z",
      secretAccessKey: "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"
    }})
    this.fileUpload(s3Client, fileParams);
    this.fileUpload(s3Client, fileInfoParams);
  }

  async fileUpload(s3Client:S3Client, params:any){
    try {
      const results = await s3Client.send(new PutObjectCommand(params));
      console.log("Successfully created " + params.Key + " and uploaded it to " + params.Bucket + "/" + params.Key);
      return results; 
    } catch (err) {
      console.log("Error", err);
    }
    return;
  }

  addTag(){
    this.tags.push(this.tag.value);
  }

  removeTag(index:number){
    this.tags.splice(index,index + 1)
  }

}