import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class ImagesProvider {
  url: string;
  headers: Headers;

  constructor(public http: Http, public authService: AuthProvider) {
    this.url = 'http://bibapp2.infolibre.ch:8082/images/';
    this.headers = new Headers();
    this.headers.append('Authorization', this.authService.token);
  }

  getImage(id: string) {
    return new Promise(resolve => {
      this.http.get(this.url + id)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  deleteImage(id) {
    this.http.delete(this.url + id, { headers: this.headers }).subscribe(res => {
      console.log(res);
    });
  }
}
