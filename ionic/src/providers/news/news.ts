import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the NewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NewsProvider {

  data: any;
  headers: any;

  constructor(public http: Http) {
    this.data = null;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  getNews(year, month) {
    if (this.data) {
      return Promise.resolve(this.data);
    }
 
    return new Promise(resolve => {
      this.http.get('http://localhost:8082/news/' + year + '/' + month)
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }

  createNews(news) {
    this.http.post('http://localhost:8082/news', JSON.stringify(news), {headers: this.headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

  deleteNews(id) {

  }
}
