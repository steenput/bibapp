import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { Page } from '../page-interface';
import { BookPage } from '../book/book';
import { BookProvider } from '../../providers/book/book';
import { TypeList } from '../typeList';

@Component({
  selector: 'page-books',
  templateUrl: 'books.html',
})
export class BooksPage {
  private page: Page;
  private books: any = [];
  private loading: any;
  
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private bookProvider: BookProvider,
    private loadingCtrl: LoadingController
  ) {
    this.showLoader();
    this.page = this.navParams.get('page');
    let list = undefined;
    // switch (this.page.type) {
    //   case TypeList.News:
    //     list = this.bookProvider.getNews();
    //     break;
    //   case TypeList.Favourites:
    //     list = this.bookProvider.getFavourites();
    //     break;
    //   case TypeList.Reviews:
    //     list = this.bookProvider.getReviews();
    //     break;
    //   default:
    //     break;
    // }
    this.bookProvider.getBooks(this.page.type).then(data => {
      console.log(data)
      data.documents.forEach(doc => {
        this.books.push(doc);
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
        book: this.books.find(b => { return b.id === id })
      });
    }
  }

}
