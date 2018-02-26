import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class BookProvider {
  url: string;
  news: any;
  favourites: any;
  reviews: any;

  constructor(public http: Http, public authService: AuthProvider) {
    this.url = 'http://localhost:8082/';
    this.news = null;
    this.favourites = null;
    this.reviews = null;
  }

  getBook(id: string) {
    return new Promise(resolve => {
      this.http.get(this.url + 'book/' + id)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          resolve(data.book);
        });
    });
  }

  getNews(year: string, month: string) {
    if (this.news) {
      return Promise.resolve(this.news);
    }

    return new Promise(resolve => {
      this.http.get(this.url + 'news/' + year + '/' + month)
        .map(res => res.json())
        .subscribe(data => {
          this.news = data;
          resolve(this.news);
        });
    });
  }

  saveComment(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.token);
    this.news.documents.find(n => { return n.id === data.id }).comment = data.comment;
    this.http.post(this.url + 'book/comment', JSON.stringify(data), {headers: headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

}
