import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the NewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NewsProvider {

  data: any;
  // headers: any;

  constructor(public http: Http) {
    this.data = null;
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

  saveAbstract(data) {
    console.log('in newsProvider, data', data);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:8082/news', JSON.stringify(data), {headers: headers})
    .subscribe(res => {
      console.log(res.json());
    });
  }

  deleteNews(id) {

  }
}
