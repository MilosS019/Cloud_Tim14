import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router, private userService: UsersService) {}

  formGroup: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public login(): void {
    let loginRequest: LoginRequest = {
      username: this.formGroup.value.username,
      password: this.formGroup.value.password,
    };

    this.userService.login(loginRequest).subscribe(
      (response) => {
        if (response.code == 200) {
          alert(response.body);
        } else {
          alert('Error! ' + response.body);
        }
      },
      (err) => alert(err)
    );
  }

  public goToCreateAccount(): void {
    this.router.navigate(['create-account']);
  }
}
