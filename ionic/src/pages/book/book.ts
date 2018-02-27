import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { BookProvider } from '../../providers/book/book';
import { ManageCommentPage } from '../manage-comment/manage-comment';
import { ManageFavouritePage } from '../manage-favourite/manage-favourite';
import { ManageReviewPage } from '../manage-review/manage-review';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  id: string;
  book: any;
  userConnected: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public bookProvider: BookProvider,
    public authProvider: AuthProvider
  ) {
    this.id = this.navParams.get('id');
    this.book = this.navParams.get('book');
    this.userConnected = this.authProvider.isConnected();
    
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

  addFavourite() {
    let addModal = this.modalCtrl.create(ManageFavouritePage, { id: this.id });
    addModal.onDidDismiss((data) => {
      if (data) {
        this.book.favourite = data.favourite;
        this.bookProvider.saveFavourite(data);
      }
    });
    addModal.present();
  }

  addReview() {
    let addModal = this.modalCtrl.create(ManageReviewPage, { id: this.id });
    addModal.onDidDismiss((data) => {
      if (data) {
        this.book.review = data.review;
        this.bookProvider.saveReview(data);
      }
    });
    addModal.present();
  }

  
}
