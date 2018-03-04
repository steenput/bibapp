import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class ImagesProvider {
  url: string;

  constructor(public http: Http, public authService: AuthProvider) {
    this.url = 'http://localhost:8082/images/';
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

  }
}
