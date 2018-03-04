import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';

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
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private bookProvider: BookProvider,
    public authProvider: AuthProvider,
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
    let addModal = this.modalCtrl.create(ManageCommentPage, { id: this.id, comment: this.book.comment });
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

  deleteComment() {
    console.log('delete comment');
    this.book.comment = undefined;
    this.bookProvider.deleteComment(this.id);
  }

  deleteFavourite() {
    console.log('delete favourite');
    this.book.favourite = undefined;
    this.bookProvider.deleteFavourite(this.id);
  }

  deleteReview() {
    console.log('delete review');
    this.book.review = undefined;
    this.bookProvider.deleteReview(this.id);
  }

}
