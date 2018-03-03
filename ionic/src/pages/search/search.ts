import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Page } from '../page-interface';
import { Book } from '../book';
import { BookProvider } from '../../providers/book/book';
import { ImagesProvider } from '../../providers/images/images';
import { Http } from '@angular/http';
import { BookPage } from '../book/book';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  page: Page;
  results = new Array<Book>();
  loading: any;
  searchQuery: string = '';
  items: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public bookProvider: BookProvider,
    public imagesProvider: ImagesProvider,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {
    // this.showLoader();
    this.page = this.navParams.get('page');
    
  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      console.log(val);
      this.bookProvider.search(val).then(data => {
        this.items = data;
        console.log(this.items);
      })
    }
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
        book: this.items.find(b => { return b.id === id })
      });
    }
  }

}
