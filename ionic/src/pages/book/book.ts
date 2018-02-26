import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { ManageCommentPage } from '../manage-comment/manage-comment';
import { BookProvider } from '../../providers/book/book';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  id: string;
  book: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public bookProvider: BookProvider
  ) {
    this.id = this.navParams.get('id');
    this.book = this.navParams.get('book');
    
    this.bookProvider.getBook(this.id).then(data => {
      this.book = data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  addComment() {
    let addModal = this.modalCtrl.create(ManageCommentPage, { id: this.id });
    addModal.onDidDismiss((data) => {
      if (data) {
        this.book.comment = data.comment;
        this.bookProvider.saveComment(data);
      }
    });
    addModal.present();
  }

}
