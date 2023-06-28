import { Component, OnInit, Output } from '@angular/core';
import { MyFile } from 'src/app/models/myFile.model';
import { PhotoAlbum } from 'src/app/models/photoAlbum.model';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.component.html',
  styleUrls: ['./shared-files.component.css']
})
export class SharedFilesComponent implements OnInit{
  sharedAlbums:Array<PhotoAlbum> = [];
  sharedFiles:any = []
  pathHistory:Array<string> = []; 
  currentAlbum:string = ""
  showFileInformationDialogReadOnly:boolean = false;
  @Output() selectedFile!:MyFile;

  constructor(private fileService:FileService ){}

  ngOnInit(): void {
    this.getSharedFolders();
  }
  
  getSharedFolders(){
    this.fileService.getSharedFiles().subscribe({
      next: data => {
        console.log(data)
        this.sharedAlbums = []
        this.sharedFiles = []
        for(let folder of data["folders"]){
          let album: PhotoAlbum = {
            name: folder,
            numberOfFiles: 1,
          };
          this.sharedAlbums.push(album)
        }

        for(let file of data["files"]){
          let file_path = file.split('/');
          let file_name = file_path[file_path.length - 1];
          let pair = [];
          pair.push(file);
          pair.push(file_name.split('.')[1]);
          this.sharedFiles.push(pair);
        }
        console.log(this.sharedFiles)
      },
      error: data => {
        console.log(data)
      }
    })
  }

  changeSharedFolder(albumName: string) {
    if(this.currentAlbum != "")
      this.pathHistory.push(this.currentAlbum);
    else
      this.pathHistory.push("");
    this.updateVisualForSharedFiles(albumName);
  }

  updateVisualForSharedFiles(albumName:string){
    this.fileService.getAllFiles(albumName).subscribe({
      next: data => {
        console.log(data)
        this.sharedAlbums = []
        this.sharedFiles = []
        for(let folder of data["folders"]){
          let album: PhotoAlbum = {
            name: folder,
            numberOfFiles: 1,
          };
          this.sharedAlbums.push(album)
        }

        for(let file of data["files"]){
          let file_path = file.split('/');
          let file_name = file_path[file_path.length - 1];
          let pair = [];
          pair.push(file);
          pair.push(file_name.split('.')[1]);
          this.sharedFiles.push(pair);
        }
      },
      error: data => {

      }
    })
  }

  openDescriptionReadOnly(file: any) {
    this.fileService.getSharedMetaData(file[0]).subscribe({
      next: data => {
        let fileInfo: MyFile = {
          name: file[0],
          size: data.Item.size,
          creationDate: '12.12.2020',
          lastModifiedDate: data.Item.lastModified,
          type: data.Item.type,
          description: data.Item.description,
          tags: [],
        };
        this.selectedFile = fileInfo;
        this.showFileInformationDialogReadOnly = true;
      },
      error: (data) => {},
    });
  }

  closeFileInformation() {
    this.showFileInformationDialogReadOnly = false;
  }

  goBack(){
    if(this.pathHistory.length == 0)
      return
    console.log(this.pathHistory)
    if(this.pathHistory.length == 1){
      this.getSharedFolders()
      this.pathHistory.pop()
    }
    else
      this.currentAlbum = this.pathHistory.pop()!
      this.updateVisualForSharedFiles(this.currentAlbum)
  }

  download(fileName:string){
    this.fileService.downloadSharedFile(fileName).subscribe({
      next: (data) => {
        this.handleFileDownload(data, fileName);
      },
      error: (data) => {},
    })
  }

  handleFileDownload(response: any, filename: string): void {
    console.log(response);
    let extension = filename.split('.')[1];
    const file = this.decodeFile(response, extension);
    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename; // Set the desired file name
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

  decodeFile(response: any, extension: string) {
    response = this.getUintValue(response);
    if (extension == 'txt') return new Blob([response], { type: 'text/plain' });
    else if (extension == 'png')
      return new Blob([response], { type: 'image/png' });
    else if (extension == 'jpeg')
      return new Blob([response], { type: 'image/jpeg' });
    else if (extension == 'jpg')
      return new Blob([response], { type: 'image/jpg' });
    else return new Blob([response], { type: 'application/octet-stream' });
  }

  getUintValue(response: any) {
    const byteCharacters = atob(response);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return byteArray;
  }
}
