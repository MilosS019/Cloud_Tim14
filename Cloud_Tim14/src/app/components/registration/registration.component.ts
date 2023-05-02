import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  constructor(private router: Router, private userService: UsersService) {}

  formGroup: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
  });

  public createAccount(): void {
    let user: User = {
      username: this.formGroup.value.username,
      password: this.formGroup.value.password,
      name: this.formGroup.value.name,
      lastname: this.formGroup.value.lastname,
      email: this.formGroup.value.email,
    };
    this.userService.registerUser(user).subscribe(
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

  goToLoginPage(): void {
    this.router.navigate(['login']);
  }
}
