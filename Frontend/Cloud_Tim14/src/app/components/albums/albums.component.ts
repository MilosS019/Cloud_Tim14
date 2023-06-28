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
  sharedAlbums: Array<PhotoAlbum> = [];
  
  files: any = [];
  sharedFiles: any = [];

  showFileInformationDialogReadOnly = false;
  showFolderCreationDialog = false;
  showFileInformationDialog = false;
  showUploadFileDialog = false;
  currentpath: string = '/';
  allFolders: any;
  foldersSize: any;
  pathHistory: Array<string> = []
  currentAlbum = ""
  rootFolder:string = ""
  
  @Output() selectedFile!:MyFile;
  constructor(private fileService:FileService) {
  }

  ngOnInit() {
    this.getFolders();
  }

  getFolders(){
    this.fileService.getFolders().subscribe({
      next: (data) => {
        this.rootFolder = data['folders']['SignedUserEmail'];
        this.currentAlbum = this.rootFolder;
        this.allFolders = data['folders'];
        this.foldersSize = data['folders_size'];
        for (let folder of data['folders'][this.rootFolder]) {
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
    this.allFolders[this.currentAlbum].push(albumName)
    this.allFolders[albumName] = []
    this.showFolderCreationDialog = false;
  }

  getTagsAsArray(tags:string){
    let tagsArr = []
    for(let tag of tags.split(",")){
      tagsArr.push(tag)
    }
    return tagsArr
  }

  openDescription(file: any) {
    console.log(this.currentpath + file[0])
    this.fileService.getMetaData(this.currentpath + file[0]).subscribe({
      next: data => {
        console.log(data)
        let fileInfo: MyFile = {
          name: file[0],
          size: data.Item.size,
          creationDate: data.Item.creationDate,
          lastModifiedDate: data.Item.lastModified,
          type: data.Item.type,
          description: data.Item.description,
          tags: this.getTagsAsArray(data.Item.tags),
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
        console.log("wtf")
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
    console.log("wtf")
    this.currentpath += albumName + '/';
    this.pathHistory.push(this.currentAlbum);
    this.currentAlbum = albumName;
    this.updateVisual(albumName);
  }

  
  goBack() {
    if (this.pathHistory.length == 0) return;
    this.currentAlbum = this.pathHistory.pop()!;
    let indexOfSlash = this.currentpath.lastIndexOf('/');
    this.currentpath = this.currentpath.slice(0, indexOfSlash);
    indexOfSlash = this.currentpath.lastIndexOf('/');
    this.currentpath = this.currentpath.slice(0, indexOfSlash + 1 );
    
    console.log(this.currentpath)
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

  getTagsAsString(tags:string[]){
    let tagsAsStr = ""
    for(let tag of tags){
      tagsAsStr += "," + tag
    }
    return tagsAsStr.slice(1, tagsAsStr.length)
  }

  moveFile(values:[string,string]){
    let albumName = values[0]
    let fileName = values[1]
    let fileParams: { oldPath: string; creationDate:string; path: string; type: string; size: number; lastModified: string; description: string; tags: string; };
    if(albumName == ".."){
      let prevPath = this.pathHistory[this.pathHistory.length - 1]
      if(this.pathHistory[this.pathHistory.length - 1] == this.rootFolder)
        prevPath = ""
        let today = new Date()
        fileParams = {
          'oldPath':this.currentpath + fileName,
          'path' : prevPath + "/" + fileName,
          'type' : this.selectedFile.type,
          'size' : this.selectedFile.size,
          'creationDate':this.selectedFile.creationDate,
          'lastModified' : today.toString(),
          'description' : this.selectedFile.description,
          'tags' : this.getTagsAsString(this.selectedFile.tags)
        } 
        let params = {"newPath": prevPath + "/" + fileName, "oldPath": this.currentpath + fileName, "fileParams":fileParams}
        this.startMoving(params)
    }
    else if(this.allFolders[this.currentAlbum].includes(albumName)){
      fileParams = {
        'oldPath': this.currentpath + fileName,
        'path' : this.currentpath + albumName + "/" + fileName,
        'type' : this.selectedFile.type,
        'size' : this.selectedFile.size,
        'creationDate': this.selectedFile.creationDate,
        'lastModified' : this.selectedFile.lastModifiedDate,
        'description' : this.selectedFile.description,
        'tags' : this.getTagsAsString(this.selectedFile.tags)
      }
      let params = {"newPath": this.currentpath + albumName + "/" + fileName, "oldPath": this.currentpath + fileName, "fileParams":fileParams}
      this.startMoving(params)
    }
    else{
      alert("Album must be visible")
    }
  }

  startMoving(params:any){
    console.log(params)
    if(params["newPath"] != ""){
      this.fileService.getLogedInEmail().subscribe({
        next: data=> {
          params["email"] = data["email"]
          this.fileService.moveFile(params).subscribe({
            next: data => {
              setTimeout(() => this.updateVisual(this.currentAlbum), 300)
            },
            error: data => {
              console.log(data)
            } 
          })
        }
      })
    }
    else
      alert("This is not an existing folder")
  }

  moveMetaData(albumName:string){
    let oldPath = this.selectedFile.name;
    this.selectedFile
  }

  deleteAlbum(album:PhotoAlbum){
    this.fileService.deleteAlbum(this.currentpath + album.name + "/").subscribe({
      next: data=> {
        // console.log(data)
        console.log(this.allFolders)
        console.log(album.name)
        delete this.allFolders[album.name]
        let albums = this.allFolders[this.currentAlbum]
        let index = this.findAlbumIndex(albums, album.name)
        console.log(index)
        this.allFolders[this.currentAlbum].splice(index,index + 1)
        console.log(this.allFolders)
        this.updateVisual(this.currentAlbum)
      },
      error: data => {
        console.log(data)
      }
    })
  }

  findAlbumIndex(albums:any, albumName:string){
    let counter = 0
    for(let album of albums){
      if(album == albumName)
        return counter
      counter += 1
    }
    return counter
  }
}
