import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class NewsProvider {
  data: any;
  url: string;

  constructor(public http: Http, public authService: AuthProvider) {
    this.data = null;
    this.url = 'http://localhost:8082/news/';
  }

  getNews(year: string, month: string) {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get(this.url + year + '/' + month)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  saveComment(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.token);
    this.data.documents.find(n => { return n.id === data.id }).comment = data.comment;
    this.http.post(this.url, JSON.stringify(data), {headers: headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

  deleteNews(id) {

  }
}
