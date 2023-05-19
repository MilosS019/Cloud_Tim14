import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  constructor(
    private router: Router,
    private userService: UsersService,
    private cognitoService: CognitoService
  ) {}

  isConfirm: boolean = false;
  user: User = {} as User;

  private formBuilder: FormBuilder = new FormBuilder();
  public formGroup: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  private codeFormBuilder: FormBuilder = new FormBuilder();
  public codeFormGroup: FormGroup = this.codeFormBuilder.group({
    code: ['', Validators.required],
  });

  public signUp(): void {
    this.user = {} as User;
    this.user.email = this.formGroup.value.email;
    this.user.password = this.formGroup.value.password;
    this.user.name = this.formGroup.value.email;
    this.user.lastname = this.formGroup.value.lastname;

    if (this.formGroup.valid) {
      this.cognitoService
        .signUp(this.user)
        .then(() => {
          this.isConfirm = true;
        })
        .catch((err) => {
          alert(err);
          return;
        });
    } else {
      alert('All fields are required!');
    }
  }

  public confirmSignUp(): void {
    this.user.code = this.codeFormGroup.value.code;
    this.cognitoService
      .confirmSignUp(this.user)
      .then(() => {
        this.userService.registerUser(this.user).subscribe(
          (response) => {},
          (err) => {
            alert(err.error.message);
          }
        );
        alert('You have successfully created account!');
        this.goToLoginPage();
      })
      .catch((err) => alert(err));
  }

  public createAccount(user: User): void {}

  goToLoginPage(): void {
    this.router.navigate(['']);
  }
}
