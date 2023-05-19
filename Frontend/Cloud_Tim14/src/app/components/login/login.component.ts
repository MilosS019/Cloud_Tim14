import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: User = {} as User;

  constructor(
    private router: Router,
    private userService: UsersService,
    private cognitoService: CognitoService
  ) {}

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public login(): void {
    this.user.email = this.formGroup.value.email;
    this.user.password = this.formGroup.value.password;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        localStorage.setItem('isSignIn', JSON.stringify(true));
        this.goToFileUploadPage();
      })
      .catch((err) => alert(err));
  }

  public goToCreateAccount(): void {
    this.router.navigate(['create-account']);
  }

  public goToFileUploadPage(): void {
    this.router.navigate(['file-upload']);
  }
}

// let loginRequest: LoginRequest = {
//   username: this.formGroup.value.username,
//   password: this.formGroup.value.password,
// };

// this.userService.login(loginRequest).subscribe(
//   (response) => {
//     if (response.statusCode == 200) {
//       alert(response.body);
//       this.router.navigate(['file-upload']);
//     } else {
//       alert('Error! ' + response.body);
//     }
//   },
//   (err) => alert(err)
// );
