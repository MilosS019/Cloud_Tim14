import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

import { RegistrationComponent } from './components/registration/registration.component';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
