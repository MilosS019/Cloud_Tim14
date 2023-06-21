import { Component, OnInit, Output } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';
import { FileService } from 'src/app/services/file.service';
import { MyFile } from 'src/app/models/myFile.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent implements OnInit{
  albums: Array<PhotoAlbum> = [];
  files:any = [];
  showFolderCreationDialog = false;
  showFileInformationDialog = false;
  showUploadFileDialog = false;
  currentpath:string = "/";
  allFolders: any;
  foldersSize: any;
  pathHistory: Array<string> = []
  currentAlbum = ""
  
  @Output() selectedFile!:MyFile;
  constructor(private fileService:FileService) {
  }
  
  ngOnInit(){
    this.fileService.getFolders().subscribe(
      {
        next: data => {
          let rootFolder = data["folders"]["SignedUserEmail"];
          this.currentAlbum = rootFolder
          this.allFolders = data["folders"]
          this.foldersSize = data["folders_size"]
          this.pathHistory.push(rootFolder)
          console.log(data)
          for(let folder of data["folders"][rootFolder]){
            let album: PhotoAlbum = { name: folder, numberOfFiles: data["folders_size"][folder] };
            this.albums.push(album);
          }
          for(let file of data["files"]){
            let file_path = file.split("/")
            let file_name = file_path[file_path.length - 1]
            let pair = []
            pair.push(file_name)
            pair.push(file_name.split(".")[1])
            this.files.push(pair) 
          }
          console.log(this.files)
        },
        error(data) {

        }
      }
    )
  }

  addFolderClicked(){
    this.showFolderCreationDialog = true;
  }

  closeFolderDialog(albumName:string){
    if(albumName != ""){
      let album: PhotoAlbum = { name: albumName, numberOfFiles: 0 };
      this.albums.push(album)
    }
    this.showFolderCreationDialog = false;
  }

  openDescription(file:any){
    this.fileService.getMetaData(this.currentpath + file[0]).subscribe({
      next: data => {
        console.log(data)
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
        this.showFileInformationDialog = true;
      },
      error: data => {

      }
    });
  }

  closeFileInformation(){
    this.showFileInformationDialog = false;
  }

  closeFileUploadDialog(fileName:string){
    this.files.push([fileName, fileName.split(".")[1]])
    console.log(this.files)
    this.showUploadFileDialog = false;
  }

  updateVisual(albumName:string){
    this.albums = []
    this.files = []
    for(let folder of this.allFolders[albumName]){
      if(folder == "")
        continue;
      let album: PhotoAlbum = { name: folder, numberOfFiles: this.foldersSize[folder] };
      this.albums.push(album);
    }
    this.fileService.getFiles(this.currentpath).subscribe({
      next: data => {
        for(let file of data){
          let file_path = file.split("/")
            let file_name = file_path[file_path.length - 1]
            let pair = []
            pair.push(file_name)
            pair.push(file_name.split(".")[1])
            this.files.push(pair)
        }
      },
      error: data=> {
        console.log(data)
      }
    })
  }

  changeFolder(albumName:string){
    this.currentpath += albumName + "/"
    this.pathHistory.push(this.currentAlbum)
    this.currentAlbum = albumName
    this.updateVisual(albumName)
  }

  goBack(){
    if(this.pathHistory.length == 0)
      return
    this.currentAlbum = this.pathHistory.pop()!
    let indexOfSlash = this.currentpath.lastIndexOf("/")
    this.currentpath = this.currentpath.slice(0, indexOfSlash)
    indexOfSlash = this.currentpath.lastIndexOf("/")
    this.currentpath = this.currentpath.slice(0, indexOfSlash + 1)    
    this.updateVisual(this.currentAlbum)
  }

  addFileClicked(){
    this.showUploadFileDialog = true;
  }

  handleFileDownload(response: ArrayBuffer, filename:string): void {
    const file = new Blob([response], { type: 'application/octet-stream' });
    const fileUrl = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename; // Set the desired file name
    link.click();

    URL.revokeObjectURL(fileUrl);
  }

  download(fileName:string){
    console.log(this.currentpath + fileName)
    this.fileService.downloadFiles(this.currentpath + fileName).subscribe({
      next: data => {
        this.handleFileDownload(data, fileName)
      },
      error: data => {

      }
    })
  }
}
