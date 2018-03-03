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

  getNews() {
    if (this.news !== null) {
      return Promise.resolve(this.news);
    }

    return new Promise(resolve => {
      this.http.get(this.url + 'news')
        .map(res => res.json())
        .subscribe(data => {
          this.news = data;
          resolve(this.news);
        });
    });
  }

  getNewsDate(year: string, month: string) {
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
    this.http.post(this.url + 'book/favourite', JSON.stringify(data), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });
    if (this.favourites !== null) {
      let found = this.favourites.documents.find(n => { return n.id === data.id });
      if (found) {
        found.favourite = data.favourite;
      }
      else {
        this.getBook(data.id).then(result => {
          this.favourites.documents.push(result);
        })
      }
    }
  }

  saveReview(data) {
    this.http.post(this.url + 'book/review', JSON.stringify(data), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });

    if (this.reviews !== null) {
      let found = this.reviews.documents.find(n => { return n.id === data.id });
      if (found) {
        found.review = data.review;
      }
      else {
        this.getBook(data.id).then(result => {
          this.reviews.documents.push(result);
        })
      }
    }
  }

}
