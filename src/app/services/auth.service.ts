import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from 'src/app/models/user.model';
import { map } from 'rxjs/Operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //create new user
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'apikey from firebase user';

  userToken: string;
  constructor(private http: HttpClient) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  login(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}`, authData
    ).pipe(
      map(resp => {
        this.saveToke(resp['idToken'], resp['expiresIn']);
        return resp;
      })
    );
  }

  signup(user: UserModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.url}signUp?key=${this.apikey}`, authData
    ).pipe(
      map(resp => {
        this.saveToke(resp['idToken'], resp['expiresIn']);
        return resp;
      })
    );
  }

  private saveToke(idToken: string, expiresIn: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(Number(expiresIn));
    localStorage.setItem('expiresIn', hoy.getTime().toString());
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    const expiresDate = new Date();
    expiresDate.setTime(expiresIn);
    if (expiresDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
