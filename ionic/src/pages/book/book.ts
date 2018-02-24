import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Book } from '../book';

import { AddNewsPage } from '../add-news/add-news';
import { NewsProvider } from '../../providers/news/news';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  id: string;
  book: Book;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public newsProvider: NewsProvider
  ) {
    this.id = this.navParams.get('id');
    this.book = this.navParams.get('book');
  }

  addComment() {
    let addModal = this.modalCtrl.create(AddNewsPage, { id: this.id });
    addModal.onDidDismiss((data) => {
      if (data) {
        this.book.comment = data.comment;
        this.newsProvider.saveComment(data);
      }
    });
    addModal.present();
  }

}
