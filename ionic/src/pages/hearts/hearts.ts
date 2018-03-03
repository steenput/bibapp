import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';

import { Page } from '../page-interface';
import { Book } from '../book';
import { BookProvider } from '../../providers/book/book';
import { ImagesProvider } from '../../providers/images/images';
import { Http } from '@angular/http';
import { BookPage } from '../book/book';

@Component({
  selector: 'page-hearts',
  templateUrl: 'hearts.html',
})
export class HeartsPage {
  page: Page;
  favourites = new Array<Book>();
  loading: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public bookProvider: BookProvider,
    public imagesProvider: ImagesProvider,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {
    this.showLoader();
    this.page = this.navParams.get('page');
    this.bookProvider.getFavourites().then(data => {
      data.documents.forEach(doc => {
        this.favourites.push(doc);
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
        book: this.favourites.find(b => { return b.id === id })
      });
    }
  }
}
