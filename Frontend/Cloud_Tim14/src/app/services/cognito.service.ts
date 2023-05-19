import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../environments/environments';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });
    this.checkAuthState(); // Provera statusa autentifikacije pri inicijalizaciji
  }

  private checkAuthState(): void {
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.authenticationSubject.next(true);
      })
      .catch(() => {
        this.authenticationSubject.next(false);
      });
  }

  public signUp(user: User): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: User): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: User): Promise<any> {
    return Auth.signIn(user.email, user.password).then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authenticationSubject.next(false);
    });
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public isAuthenticated(): boolean {
    if (localStorage.getItem('isSignIn')) {
      return true;
    }
    return false;
  }

  public getCurrentSession(): Promise<any> {
    return Auth.currentSession();
  }
}
