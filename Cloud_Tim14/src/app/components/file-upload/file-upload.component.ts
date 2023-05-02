import { Component } from '@angular/core';
import { PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {
  
  fileName = '';

  constructor() {

  }

  async onFileSelected(event:any) {

      const file:File = event.target.files[0];
      const params = {
        Bucket: "cloud-project-files-bucket", // The name of the bucket. For example, 'sample-bucket-101'.
        Key: file.name, // The name of the object. For example, 'sample_upload.txt'.
        Body: file, // The content of the object. For example, 'Hello world!".
      };

      if (file) {
        try {
          const s3Client = new S3Client({region:"eu-north-1", credentials:{
            accessKeyId: "AKIA4IB5G6SAVTWWTL7Z",
            secretAccessKey: "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"
          }})
          const results = await s3Client.send(new PutObjectCommand(params));
          console.log(
              "Successfully created " +
              params.Key +
              " and uploaded it to " +
              params.Bucket +
              "/" +
              params.Key
          );
          return results; // For unit tests.
        } catch (err) {
          console.log("Error", err);
        }    
      }
      return null
    }
}
