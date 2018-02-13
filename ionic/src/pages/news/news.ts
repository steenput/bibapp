import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Page } from '../page-interface';
import { News } from '../news-class';

import { AddNewsPage } from '../add-news/add-news';

import { NewsProvider } from '../../providers/news/news';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  page: Page;
  news: Array<News>;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public newsProvider: NewsProvider,
    public http: Http
  ) {
    this.page = this.navParams.get('page');
    this.news = new Array<News>();

    this.http.get('http://localhost:8082/news/2018/02')
    .map(res => res.json())
    .subscribe(snews => {
      // console.log(snews);
      snews.documents.forEach(doc => {
        this.news.push(new News(doc.id, doc.title, doc.author, doc.language, 
          doc.creationdate, doc.description,doc.publisher, doc.abstract));
      });
    })
  }

  addAbstract(id: string) {    
    let addModal = this.modalCtrl.create(AddNewsPage, {id: id});
    addModal.onDidDismiss((data) => {
      if (data) {
        // TODO: add to news local, to load fast
        this.saveAbstract(data); 
      }
    });
    addModal.present();
  }

  saveAbstract(data: any) {
    this.newsProvider.saveAbstract(data);
  }

}
