import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthProvider } from '../auth/auth';
import { TypeList } from '../../pages/typeList';

@Injectable()
export class BookProvider {
  private url: string;
  private headers: Headers;
  private news: any;
  private favourites: any;
  private reviews: any;

  constructor(public http: Http, public authService: AuthProvider) {
    this.url = 'http://localhost:8082/';
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', this.authService.token);
    this.news = null;
    this.favourites = null;
    this.reviews = null;
  }

  getBooks(type: TypeList) {
    switch (type) {
      case TypeList.News:
        console.log('news')
        return this.getNews();
      case TypeList.Favourites:
        return this.getFavourites();
      case TypeList.Reviews:
        return this.getReviews();    
      default:
        break;
    }
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

  private subGetNews(url: string) {
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

  getNews() {
    console.log('getNews')
    return this.subGetNews(this.url + 'news');
    }

  getNewsDate(year: string, month: string) {
    return this.subGetNews(this.url + 'news/' + year + '/' + month);
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
      });
    });
  }

  saveComment(data) {
    if (this.news !== null)
      this.news.documents.find(n => { return n.id === data.id }).comment = data.content;

    this.http.post(this.url + 'book/comment', JSON.stringify(data), { headers: this.headers })
    .subscribe(res => {
      console.log(res.json());
    });
  }

  saveFavourite(data) {
    this.http.post(this.url + 'book/favourite', JSON.stringify(data), { headers: this.headers })
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
        });
      }
    }
  }

  saveReview(data) {
    this.http.post(this.url + 'book/review', JSON.stringify(data), { headers: this.headers })
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
        });
      }
    }
  }

  deleteComment(id) {
    console.log('comment', id);
    this.http.delete(this.url + 'book/comment/' + id, { headers: this.headers })
    .subscribe(res => {
      console.log(res.json());
    });
  }

  deleteFavourite(id) {
    console.log('favourite', id);
    this.http.delete(this.url + 'book/favourite/' + id, { headers: this.headers })
    .subscribe(res => {
      console.log(res.json());
    });
    if (this.favourites !== null) {
      const index = this.favourites.documents.findIndex(i => { return i.id === id });
      if (index > -1)
        this.favourites.documents.splice(index, 1);
    }
  }

  deleteReview(id) {
    console.log('review', id);
    this.http.delete(this.url + 'book/review/' + id, { headers: this.headers })
    .subscribe(res => {
      console.log(res.json());
    });
    if (this.reviews !== null) {
      const index = this.reviews.documents.findIndex(i => { return i.id === id });
      if (index > -1)
        this.reviews.documents.splice(index, 1);
    }
  }

}
