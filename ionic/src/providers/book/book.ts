import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';

@Injectable()
export class BookProvider {
  url: string;
  headers: Headers;
  news: any;
  favourites: any;
  reviews: any;

  constructor(public http: Http, public authService: AuthProvider) {
    this.url = 'http://localhost:8082/';
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', this.authService.token);
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
    if (this.news !== null) {
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

  getFavourites() {
    if (this.favourites !== null) {
      return Promise.resolve(this.favourites);
    }

    return new Promise(resolve => {
      this.http.get(this.url + 'favourites/')
        .map(res => res.json())
        .subscribe(data => {
          this.favourites = data;
          resolve(this.favourites);
        });
    });
  }

  getReviews() {
    if (this.reviews !== null) {
      return Promise.resolve(this.reviews);
    }

    return new Promise(resolve => {
      this.http.get(this.url + 'reviews/')
        .map(res => res.json())
        .subscribe(data => {
          this.reviews = data;
          resolve(this.reviews);
        });
    });
  }

  search(str) {
    return new Promise(resolve => {
      this.http.get(this.url + 'search/' + str).map(res => res.json())
      .subscribe(data => {
        resolve(data.documents);
      })
    });
  }

  saveComment(data) {
    if (this.news !== null)
      this.news.documents.find(n => { return n.id === data.id }).comment = data.comment;

    this.http.post(this.url + 'book/comment', JSON.stringify(data), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

  saveFavourite(data) {
    if (this.favourites !== null)
      this.favourites.documents.find(n => { return n.id === data.id }).favourite = data.favourite;
    
    this.http.post(this.url + 'book/favourite', JSON.stringify(data), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

  saveReview(data) {
    if (this.reviews !== null)
      this.reviews.documents.find(n => { return n.id === data.id }).review = data.review;

    this.http.post(this.url + 'book/review', JSON.stringify(data), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

}
