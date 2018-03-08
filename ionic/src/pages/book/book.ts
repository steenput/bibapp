import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';

import { BookProvider } from '../../providers/book/book';
import { ContentPage } from '../content/content';
import { AuthProvider } from '../../providers/auth/auth';
import { ImagesProvider } from '../../providers/images/images';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
  private id: string;
  private book: any;
  private userConnected: boolean;
  private comment: string = 'comment';
  private favourite: string = 'favourite';
  private review: string = 'review';

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private bookProvider: BookProvider,
    private authProvider: AuthProvider,
    private imagesProvider: ImagesProvider
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

  addContent(type: string) {
    console.log(type);
    let content = 'test';
    let title = '';
    switch (type) {
      case this.comment:
        content = this.book.comment;
        title = 'Commentaire';
        break;
      case this.favourite:
        content = this.book.favourite;
        title = 'Coup de coeur';
        break;
      case this.review:
        content = this.book.review;
        title = 'Revue de presse';
        break;
      default:
        break;
    }
    console.log(content);
    let addModal = this.modalCtrl.create(ContentPage, { id: this.id, content: content, title: title });
    addModal.onDidDismiss((data) => {
      if (data) {
        switch (type) {
          case this.comment:
            this.book.comment = data.content;
            this.bookProvider.saveComment(data);
            break;
          case this.favourite:
            this.book.favourite = data.content;
            this.bookProvider.saveFavourite(data);
            break;
          case this.review:
            this.book.review = data.content;
            this.bookProvider.saveReview(data);
            break;
          default:
            break;
        }
      }
    });
    addModal.present();
  }

  deleteContent(type: string) {
    switch (type) {
      case this.comment:
        this.book.comment = undefined;
        this.bookProvider.deleteComment(this.id);
        break;
      case this.favourite:
        this.book.favourite = undefined;
        this.bookProvider.deleteFavourite(this.id);
        break;
      case this.review:
        this.book.review = undefined;
        this.bookProvider.deleteReview(this.id);
        break;
      default:
        break;
    }
  }

  deleteImage() {
    this.imagesProvider.deleteImage(this.id);
  }
}
