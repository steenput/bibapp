import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Page } from '../page-interface';
import { News } from '../news-class';

import { AddNewsPage } from '../add-news/add-news';

import { DataProvider } from '../../providers/data/data';
import { Section } from '../section-class';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  page: Page;
  sections: Array<Section>;
  news: Array<News>;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public dataProvider: DataProvider,
    public http: Http
  ) {
    this.page = this.navParams.get('page');
    this.news = new Array<News>();
    this.sections = new Array<Section>();    

    this.http.get('http://api.bibapp.infolibre.ch:7070/section')
    .map(res => res.json())
    .subscribe(
      section => {
        section.data.sections.forEach(s => {
          this.sections[s.id] = new Section(s.id, s.name, s.acronym, s.code);
        });

        this.http.get('http://api.bibapp.infolibre.ch:7070/book')
        .map(res => res.json())
        .subscribe(
          book => {
            book.data.books.forEach(b => {
              this.news.push(new News(
                b.id, b.title, b.author, b.language, b.year, b.description, 
                b.editor, this.sections[b.section], "")
              );
            });
          },
          err => {
            console.log("Error : ", err);
          },
          () => {
            console.log("callback hell done");
            this.news.forEach(c => {
              this.dataProvider.getComment(c.id).then((data) => {c.comment = data});
            });
          }
        );

      },
      err => {
        console.log("Error : ", err);
      }
    );
  }

  addComment(id: string) {    
    let addModal = this.modalCtrl.create(AddNewsPage, {id: id});
    addModal.onDidDismiss((data) => {
      if (data) { this.saveComment(data); }
    });
    addModal.present();
  }

  saveComment(data: any) {
    this.dataProvider.saveComment(data.id, data.comment);
  }

}
