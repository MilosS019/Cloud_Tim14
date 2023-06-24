import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CognitoService } from '../../services/cognito.service';
import { RegistrationRequestService } from '../../services/registration-request.service';

@Component({
  selector: 'app-inviter-family-memeber',
  templateUrl: './inviter-family-memeber.component.html',
  styleUrls: ['./inviter-family-memeber.component.css'],
})
export class InviterFamilyMemeberComponent {
  constructor(
    private router: Router,
    private registrationRequestService: RegistrationRequestService
  ) {}

  formGroup: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  public sendInvite(): void {
    let email: string = this.formGroup.value.email;
    this.registrationRequestService.sendInvite(email).subscribe(
      (response: any) => {
        console.log(response);
        alert(response.message);
      },
      (err) => {
        console.log(err);
        alert(err.error.message);
      }
    );
  }
}
