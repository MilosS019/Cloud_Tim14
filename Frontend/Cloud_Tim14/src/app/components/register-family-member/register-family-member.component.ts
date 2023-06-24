import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RegistrationRequestService } from '../../services/registration-request.service';
import { RegistrationRequest } from '../../models/regisstrationRequest.model';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register-family-member',
  templateUrl: './register-family-member.component.html',
  styleUrls: ['./register-family-member.component.css'],
})
export class RegisterFamilyMemberComponent {
  registrationRequest: RegistrationRequest = {} as RegistrationRequest;
  constructor(
    private router: Router,
    private registrationRequestService: RegistrationRequestService,
    private cognitoService: CognitoService
  ) {}

  private formBuilder: FormBuilder = new FormBuilder();
  public formGroup: FormGroup = this.formBuilder.group({
    invited_user_email: ['', Validators.required],
    password: ['', Validators.required],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    birthday: ['', birthdayValidator],
    inviter_email: ['', Validators.required],
  });

  public signUp(): void {
    this.registrationRequest = {} as RegistrationRequest;
    this.registrationRequest.invited_user_email =
      this.formGroup.value.invited_user_email;
    this.registrationRequest.password = this.formGroup.value.password;
    this.registrationRequest.name = this.formGroup.value.name;
    this.registrationRequest.lastname = this.formGroup.value.lastname;
    this.registrationRequest.birthday = this.formGroup.value.birthday;
    this.registrationRequest.inviter_email = this.formGroup.value.inviter_email;

    console.log(this.registrationRequest);
    if (this.formGroup.controls['birthday'].invalid) {
      alert('Invalid date!');
      return;
    }

    if (this.formGroup.valid) {
      this.registrationRequestService
        .saveRegistrationRequest(this.registrationRequest)
        .subscribe(
          (response: any) => {
            console.log(response);
            alert(response.message);
          },
          (err) => {
            console.log(err);
            alert(err.error);
          }
        );
    }
  }
}

function birthdayValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const birthday = control.value;

  // Provera da li je unet datum
  if (!birthday) {
    return null; // Prolazi validaciju ako nije unet datum
  }

  // Konverzija unetog datuma u objekat Date
  const birthdayDate = new Date(birthday);

  // Provera da li je unet ispravan datum
  if (isNaN(birthdayDate.getTime())) {
    return { invalidBirthday: true }; // Ne prolazi validaciju ako nije ispravan datum
  }

  // Dodatne provere po potrebi...

  return null; // Prolazi validaciju ako je unet ispravan datum
}
