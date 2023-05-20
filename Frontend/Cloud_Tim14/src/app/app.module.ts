import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { FileComponent } from './components/file/file.component';
import { FilesComponent } from './components/files/files.component';
import { AlbumComponent } from './components/album/album.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { CreateAlbumComponent } from './components/create-album/create-album.component';
import { FileEditComponent } from './components/file-edit/file-edit.component';
import { EditFileComponent } from './components/edit-file/edit-file.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    FileUploadComponent,
    NavMenuComponent,
    FileComponent,
    FilesComponent,
    AlbumComponent,
    AlbumsComponent,
    CreateAlbumComponent,
    FileEditComponent,
    EditFileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
