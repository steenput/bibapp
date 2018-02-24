import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Page } from '../page-interface';
import { Book } from '../book';

import { AddNewsPage } from '../add-news/add-news';
import { BookPage } from '../book/book';

import { NewsProvider } from '../../providers/news/news';
import { ImagesProvider } from '../../providers/images/images';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  page: Page;
  news = new Array<Book>();
  loading: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public newsProvider: NewsProvider,
    public imagesProvider: ImagesProvider,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {
    this.showLoader();
    this.page = this.navParams.get('page');
    let date = new Date();
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
    this.newsProvider.getNews(date.getFullYear().toString(), month).then(data => {
      data.documents.forEach(doc => {
        this.news.push(doc);
      });
      this.loading.dismiss();
    })
    .catch(err => {
      this.loading.dismiss();
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }

  openBook(id) {
    if (id) {
      this.navCtrl.push(BookPage, {
        id: id,
        book: this.news.find(b => { return b.id === id })
      });
    }
  }

}
