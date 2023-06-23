import { Component } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { PermissionService } from '../../services/permission.service';
import { User } from '../../models/user.model';
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
    private permissionService: PermissionService
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
    // this.usersService.fetchUsers().subscribe(
    //   (response) => {
    //     console.log(response);
    //   },
    //   (err) => alert(err.error.message)
    // );
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
}
