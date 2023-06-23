import { Component, OnInit, Output } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';
import { FileService } from 'src/app/services/file.service';
import { MyFile } from 'src/app/models/myFile.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent implements OnInit {
  albums: Array<PhotoAlbum> = [];
  files: any = [];
  showFolderCreationDialog = false;
  showFileInformationDialog = false;
  showUploadFileDialog = false;
  currentpath: string = '/';
  allFolders: any;
  foldersSize: any;
  pathHistory: Array<string> = []
  currentAlbum = ""
  
  @Output() selectedFile!:MyFile;
  constructor(private fileService:FileService) {
  }

  ngOnInit() {
    this.fileService.getFolders().subscribe({
      next: (data) => {
        let rootFolder = data['folders']['SignedUserEmail'];
        this.currentAlbum = rootFolder;
        this.allFolders = data['folders'];
        this.foldersSize = data['folders_size'];
        this.pathHistory.push(rootFolder);
        console.log(data);
        for (let folder of data['folders'][rootFolder]) {
          let album: PhotoAlbum = {
            name: folder,
            numberOfFiles: data['folders_size'][folder],
          };
          this.albums.push(album);
        }
        for (let file of data['files']) {
          let file_path = file.split('/');
          let file_name = file_path[file_path.length - 1];
          let pair = [];
          pair.push(file_name);
          pair.push(file_name.split('.')[1]);
          this.files.push(pair);
        }
        console.log(this.files);
      },
      error(data) {},
    });
  }

  addFolderClicked() {
    this.showFolderCreationDialog = true;
  }

  closeFolderDialog(albumName: string) {
    if (albumName != '') {
      let album: PhotoAlbum = { name: albumName, numberOfFiles: 0 };
      this.albums.push(album);
    }
    this.showFolderCreationDialog = false;
  }

  openDescription(file: any) {
    this.fileService.getMetaData(this.currentpath + file[0]).subscribe({
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
        this.showFileInformationDialog = true;
      },
      error: (data) => {},
    });
  }

  closeFileInformation() {
    this.showFileInformationDialog = false;
  }

  closeFileUploadDialog(fileName:string){
    this.files.push([fileName, fileName.split(".")[1]])
    this.showUploadFileDialog = false;
  }

  updateVisual(albumName: string) {
    this.albums = [];
    this.files = [];
    for (let folder of this.allFolders[albumName]) {
      if (folder == '') continue;
      let album: PhotoAlbum = {
        name: folder,
        numberOfFiles: this.foldersSize[folder],
      };
      this.albums.push(album);
    }
    this.fileService.getFiles(this.currentpath).subscribe({
      next: (data) => {
        console.log(data)
        for (let file of data) {
          let file_path = file.split('/');
          let file_name = file_path[file_path.length - 1];
          let pair = [];
          pair.push(file_name);
          pair.push(file_name.split('.')[1]);
          this.files.push(pair);
        }
      },
      error: (data) => {
        console.log(data);
      },
    });
  }

  changeFolder(albumName: string) {
    this.currentpath += albumName + '/';
    this.pathHistory.push(this.currentAlbum);
    this.currentAlbum = albumName;
    this.updateVisual(albumName);
  }

  goBack() {
    if (this.pathHistory.length == 0) return;
    this.currentAlbum = this.pathHistory.pop()!;
    let indexOfSlash = this.currentpath.lastIndexOf('/');
    this.currentpath = this.currentpath.slice(0, indexOfSlash + 1);
    this.updateVisual(this.currentAlbum);
  }

  addFileClicked() {
    this.showUploadFileDialog = true;
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

  getUintValue(response: any) {
    const byteCharacters = atob(response);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return byteArray;
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

  download(fileName:string){
    this.fileService.downloadFiles(this.currentpath + fileName).subscribe({
      next: (data) => {
        this.handleFileDownload(data, fileName);
      },
      error: (data) => {},
    });
  }

  close(){
    this.showUploadFileDialog = false;
  }

  rename(oldAndNewFolderName:any, album: PhotoAlbum){
    this.allFolders[oldAndNewFolderName[1]] = this.allFolders[oldAndNewFolderName[0]]
    delete this.allFolders[oldAndNewFolderName[0]]
    album.name = oldAndNewFolderName[1]

    console.log(oldAndNewFolderName[0])

    let index = this.allFolders[this.currentAlbum].findIndex((element: any) => element == oldAndNewFolderName[0])
    this.allFolders[this.currentAlbum][index] = oldAndNewFolderName[1]

    let old_path = this.currentpath + oldAndNewFolderName[0] + "/";
    let new_path = this.currentpath + oldAndNewFolderName[1] + "/";
    console.log(old_path)
    console.log(new_path)
    this.fileService.renameFolder({"oldPath":old_path, "newPath": new_path}).subscribe({
      next: data => {
        console.log(data)
      },
      error: data => {
        console.log(data)
      }
    })
  }
}
