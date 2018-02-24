import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
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

  saveImage(data) {
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', this.authService.token);
    // this.data.documents.find(n => { return n.id === data.id }).comment = data.comment;
    // this.http.post(this.url + data.id, JSON.stringify(data), {headers: headers})
    // .subscribe(res => {
    //   console.log(res.json());
    // });
  }

  deleteImage(id) {

  }
}
