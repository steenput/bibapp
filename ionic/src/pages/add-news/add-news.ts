import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-add-news',
  templateUrl: 'add-news.html',
})
export class AddNewsPage {
  id: string;
  abstract: string;

  constructor(public view: ViewController, params: NavParams) {
    this.id = params.get('id');
  }

  saveAbstract() {
    this.view.dismiss({id: this.id, abstract: this.abstract});
  }
    
  close() {
    this.view.dismiss();
  }

}
