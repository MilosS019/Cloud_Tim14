import { Component } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PermissionService } from '../../services/permission.service';
import { User } from '../../models/user.model';
import { FileService } from 'src/app/services/file.service';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
  constructor(
    private cognitoService: CognitoService,
    private router: Router,
    private usersService: UsersService,
    private permissionService: PermissionService,
    private fileService: FileService
  ) {}

  public isAuthenticated(): boolean {
    return this.cognitoService.isAuthenticated();
  }

  public logOut(): void {
    this.cognitoService
      .signOut()
      .then(() => {
        alert('You have logOut');
        localStorage.removeItem('isSignIn');
        this.goToLoginPage();
      })
      .catch((err) => alert(err));
  }

  public goToLoginPage(): void {
    this.router.navigate(['']);
  }

  public fetchUsers() {
    this.usersService.fetchUsers().subscribe(
      (response) => {
        console.log(response);
      },
      (err) => alert(err.error.message)
    );
  }

  public goToAlbumsPage() {
    this.router.navigate(['albums']);
  }
  public goToFileUploadPage() {
    this.router.navigate(['file-upload']);
  }

  public goToCreateAlbumPage() {
    this.router.navigate(['create-album']);
  }

  public goToInviteFamilyMemberPage() {
    this.router.navigate(['invite-family-member']);
  }

  public goToVerifyFamilyMemberPage() {
    this.router.navigate(['verify-family-member']);
  }
  
  public goToSharedFiles() {
    this.router.navigate(['shared-files']);
  }

  public test(){
    this.fileService.test().subscribe({
      next: data=>{
        console.log(data);
      },
      error: data=>{
        console.log(data);
      }
    });
  }
}
