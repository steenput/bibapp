import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  public token: any;
  private url: string;

  constructor(public http: Http, public storage: Storage) {
    this.url = 'http://localhost:8082/auth/';
  }

  checkAuthentication() {
    return new Promise((resolve, reject) => {
        //Load token if exists
        this.storage.get('token').then(value => {
          this.token = value;
          let headers = new Headers();
          headers.append('Authorization', this.token);
          this.http.get(this.url + 'protected', { headers: headers })
          .subscribe(
            res => {
              console.log(res);
              resolve(res);
            },
            err => {
              console.log(err);
              reject(err);
            }
          );
        });
    });
  }

  createAccount(details) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.url + 'register', JSON.stringify(details), { headers: headers })
      .subscribe(res => {
        console.log('in createAccount', res);
        let data = res.json();
        this.token = data.token;
        this.storage.set('token', data.token);
        resolve(data);
      }, err => { reject(err); }
      );
    });
  }

  login(credentials) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.url + 'login', JSON.stringify(credentials), { headers: headers })
          .subscribe(res => {
            console.log('in auth login', res);
            let data = res.json();
            this.token = data.token;
            this.storage.set('token', data.token);
            resolve(data);
          }, err => {
            reject(err);
          });
    });
  }

  logout() {
    console.log('logout');
    this.storage.set('token', '');
  }
}
