import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';
import { FilesComponent } from './components/files/files.component';
import { CreateAlbumComponent } from './components/create-album/create-album.component';
import { EditFileComponent } from './components/edit-file/edit-file.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'create-account',
    component: RegistrationComponent,
    canActivate: [NotAuthorizedGuard],
  },
  {
    path: 'file-upload',
    component: FileUploadComponent,
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'files',
    component: FilesComponent,
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'albums',
    component: AlbumsComponent,
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'create-album',
    component: CreateAlbumComponent,
    canActivate: [AuthorizedGuard],
  },
  {
    path: 'file-edit',
    component: EditFileComponent,
    canActivate: [AuthorizedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
