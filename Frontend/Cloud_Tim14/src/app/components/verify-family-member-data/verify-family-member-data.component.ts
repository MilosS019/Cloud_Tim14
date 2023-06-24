import { Component, OnInit } from '@angular/core';
import { RegistrationRequest } from '../../models/regisstrationRequest.model';
import { RegistrationRequestService } from '../../services/registration-request.service';
@Component({
  selector: 'app-verify-family-member-data',
  templateUrl: './verify-family-member-data.component.html',
  styleUrls: ['./verify-family-member-data.component.css'],
})
export class VerifyFamilyMemberDataComponent implements OnInit {
  registrationRequests: Array<RegistrationRequest> = [];
  constructor(private registrationRequestService: RegistrationRequestService) {}

  ngOnInit(): void {
    this.registrationRequestService.getRegistrationRequests().subscribe(
      (response) => {
        this.registrationRequests = response;
      },
      (err) => {
        console.log(err);
        alert(err.error);
      }
    );
  }

  public accept(registrationRequest: RegistrationRequest, index: number): void {
    this.registrationRequestService
      .acceptRequest(registrationRequest.invited_user_email)
      .subscribe(
        (response: any) => {
          this.registrationRequests.splice(index, 1);
          alert(response.message);
        },
        (err) => {
          console.log(err);
          alert(err.error);
        }
      );
  }
  public reject(registrationRequest: RegistrationRequest, index: number): void {
    this.registrationRequestService
      .removeRegistrationRequest(registrationRequest.invited_user_email)
      .subscribe(
        (response: any) => {
          this.registrationRequests.splice(index, 1);
          alert(response.message);
        },
        (err) => alert(err.error)
      );
  }
}
